import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE } from "../constants/config";

const BACKEND_URL = `${API_BASE}/api/details/dashboard`;

type GoodsItem = {
  goodsName: string;
  quantity: string;
  _id?: string;
};

type DispatchRecord = {
  _id: string;
  goods: GoodsItem[];
  transportName: string;
  transportNumber: string;
  receiverName: string;
  receiverNumber: string;
  date: string;
  status: string;
};

type DashboardData = {
  records: DispatchRecord[];
  summary: {
    totalDispatches: number;
    totalQuantity: number;
    goodsBreakdown: Record<string, number>;
    clientBreakdown: Record<string, number>;
    transportBreakdown: Record<string, number>;
  };
};

const getRecentMonths = () => {
  const months = [];
  const date = new Date();
  for (let i = 0; i < 12; i++) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const label = date.toLocaleString("default", { month: "short", year: "numeric" });
    months.push({ value: `${year}-${month}`, label });
    date.setMonth(date.getMonth() - 1);
  }
  return months;
};

export default function MainDashboard() {
  const router = useRouter();
  const recentMonths = useMemo(() => getRecentMonths(), []);

  const [filterType, setFilterType] = useState<"weekly" | "monthly" | "particular">("weekly");
  const [selectedMonth, setSelectedMonth] = useState<string>(recentMonths[0].value);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { filterType };
      if (filterType === "particular") {
        params.month = selectedMonth;
      }
      const response = await axios.get(BACKEND_URL, { params });
      setData(response.data);
    } catch (error) {
      console.log("Fetch dashboard error:", error);
      Alert.alert("Error", "Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterType, selectedMonth]);

  const formatPhoneNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return num;
  };

  const currentMonthLabel = useMemo(() => {
    const found = recentMonths.find((m) => m.value === selectedMonth);
    return found ? found.label : selectedMonth;
  }, [selectedMonth, recentMonths]);

  // Render stats cards, charts, and summaries
  const renderHeaderComponent = () => {
    if (!data) return null;

    const { summary } = data;
    const maxGoodsQty = Math.max(...Object.values(summary.goodsBreakdown), 1);

    return (
      <View style={styles.headerContentContainer}>
        {/* Date / Month Picker if Select Month is selected */}
        {filterType === "particular" && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthsScrollView}
            >
              {recentMonths.map((m) => {
                const isActive = selectedMonth === m.value;
                return (
                  <TouchableOpacity
                    key={m.value}
                    style={[styles.monthPill, isActive && styles.monthPillActive]}
                    onPress={() => setSelectedMonth(m.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.monthPillText, isActive && styles.monthPillTextActive]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Card 1: Total Shipments */}
          <View style={[styles.statCard, { borderLeftColor: "#2563eb" }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cube-outline" size={20} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>{summary.totalDispatches}</Text>
            <Text style={styles.statLabel}>Shipments Sent</Text>
          </View>

          {/* Card 2: Total Items */}
          <View style={[styles.statCard, { borderLeftColor: "#10b981" }]}>
            <View style={[styles.statIconContainer, { backgroundColor: "#ecfdf5" }]}>
              <Ionicons name="apps-outline" size={20} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{summary.totalQuantity}</Text>
            <Text style={styles.statLabel}>Total Units Sent</Text>
          </View>
        </View>

        {/* Goods Breakdown Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="bar-chart-outline" size={18} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Goods Dispatched Summary</Text>
          </View>

          {Object.keys(summary.goodsBreakdown).length === 0 ? (
            <Text style={styles.emptyBreakdownText}>No goods items dispatched in this period.</Text>
          ) : (
            <View style={styles.breakdownList}>
              {Object.entries(summary.goodsBreakdown).map(([goodsName, qty]) => {
                const ratio = qty / maxGoodsQty;
                return (
                  <View key={goodsName} style={styles.breakdownRow}>
                    <View style={styles.breakdownInfo}>
                      <Text style={styles.breakdownName}>{goodsName}</Text>
                      <Text style={styles.breakdownQty}>
                        {qty} {qty === 1 ? "unit" : "units"}
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${ratio * 100}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Client Summary section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="people-outline" size={18} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Client Shipments</Text>
          </View>

          {Object.keys(summary.clientBreakdown).length === 0 ? (
            <Text style={styles.emptyBreakdownText}>No client dispatches in this period.</Text>
          ) : (
            <View style={styles.clientTagsContainer}>
              {Object.entries(summary.clientBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([clientName, count]) => (
                  <View key={clientName} style={styles.clientTag}>
                    <Ionicons name="person-outline" size={12} color="#1e293b" style={{ marginRight: 4 }} />
                    <Text style={styles.clientTagText}>
                      {clientName} <Text style={styles.clientTagCount}>({count})</Text>
                    </Text>
                  </View>
                ))}
            </View>
          )}
        </View>

        <Text style={styles.listSectionHeader}>Detailed Records</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Ionicons name="document-text-outline" size={60} color="#cbd5e1" />
        <Text style={styles.emptyStateTitle}>No Records Found</Text>
        <Text style={styles.emptyStateText}>
          There are no dispatches registered for this {filterType === "weekly" ? "week" : filterType === "monthly" ? "month" : `month (${currentMonthLabel})`}.
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: DispatchRecord }) => {
    return (
      <View style={styles.recordCard}>
        <View style={styles.recordCardHeader}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={14} color="#2563eb" style={{ marginRight: 4 }} />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, item.status === "delivered" ? styles.deliveredBadge : styles.dispatchedBadge]}>
            <Text style={[styles.statusText, item.status === "delivered" ? styles.deliveredText : styles.dispatchedText]}>
              {item.status === "delivered" ? "Delivered" : "Dispatched"}
            </Text>
          </View>
        </View>

        <View style={styles.recordDivider} />

        <View style={styles.recordCardContent}>
          {/* Goods Display */}
          <View style={styles.recordDetailRow}>
            <Ionicons name="cube" size={16} color="#475569" style={styles.recordIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recordDetailLabel}>Goods Details</Text>
              <Text style={styles.recordDetailValue}>
                {item.goods && Array.isArray(item.goods) && item.goods.length > 0
                  ? item.goods.map((g) => `${g.goodsName} (${g.quantity})`).join(", ")
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Receiver Display */}
          <View style={styles.recordDetailRow}>
            <Ionicons name="person" size={16} color="#475569" style={styles.recordIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recordDetailLabel}>Receiver</Text>
              <Text style={styles.recordDetailValue}>
                {item.receiverName} · <Text style={styles.phoneLink}>{formatPhoneNumber(item.receiverNumber)}</Text>
              </Text>
            </View>
          </View>

          {/* Transport Display */}
          <View style={styles.recordDetailRow}>
            <Ionicons name="bus" size={16} color="#475569" style={styles.recordIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recordDetailLabel}>Transport</Text>
              <Text style={styles.recordDetailValue}>
                {item.transportName} · <Text style={styles.phoneLink}>{formatPhoneNumber(item.transportNumber)}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/dashboard")}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1e3a8a" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Main Dashboard</Text>
          <Text style={styles.subtitle}>Amrut Automobiles</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchDashboardData}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, filterType === "weekly" && styles.tabActive]}
          onPress={() => setFilterType("weekly")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, filterType === "weekly" && styles.tabTextActive]}>Weekly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filterType === "monthly" && styles.tabActive]}
          onPress={() => setFilterType("monthly")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, filterType === "monthly" && styles.tabTextActive]}>Monthly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filterType === "particular" && styles.tabActive]}
          onPress={() => setFilterType("particular")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, filterType === "particular" && styles.tabTextActive]}>Select Month</Text>
        </TouchableOpacity>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Fetching Records...</Text>
        </View>
      ) : (
        <FlatList
          data={data?.records || []}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeaderComponent}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  // ── Header ──────────────────────────────────────
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 99,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 1,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Tabs ────────────────────────────────────────
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
    borderRadius: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // ── Scroll / Content ────────────────────────────
  listContent: {
    paddingBottom: 32,
  },
  headerContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Month Picker ────────────────────────────────
  pickerContainer: {
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  monthsScrollView: {
    gap: 8,
    paddingBottom: 4,
  },
  monthPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  monthPillActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },
  monthPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  monthPillTextActive: {
    color: "#2563eb",
    fontWeight: "700",
  },

  // ── Stats ───────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },

  // ── Sections ────────────────────────────────────
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  emptyBreakdownText: {
    fontSize: 13,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },

  // ── Breakdown List ──────────────────────────────
  breakdownList: {
    gap: 14,
  },
  breakdownRow: {
    gap: 6,
  },
  breakdownInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  breakdownQty: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
  },

  // ── Client Breakdown ────────────────────────────
  clientTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  clientTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clientTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
  },
  clientTagCount: {
    color: "#2563eb",
    fontWeight: "700",
  },

  // ── Detailed Records List Title ─────────────────
  listSectionHeader: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  // ── Record Cards ────────────────────────────────
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  recordCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563eb",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dispatchedBadge: {
    backgroundColor: "#fef3c7",
  },
  deliveredBadge: {
    backgroundColor: "#d1fae5",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  dispatchedText: {
    color: "#b45309",
  },
  deliveredText: {
    color: "#065f46",
  },
  recordDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  recordCardContent: {
    gap: 10,
  },
  recordDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recordIcon: {
    marginTop: 2,
    marginRight: 10,
    color: "#3b82f6",
  },
  recordDetailLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  recordDetailValue: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "600",
  },
  phoneLink: {
    color: "#2563eb",
    fontWeight: "600",
  },

  // ── Loading state ───────────────────────────────
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },

  // ── Empty State ─────────────────────────────────
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});
