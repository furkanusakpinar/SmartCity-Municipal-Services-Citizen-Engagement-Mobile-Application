import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView,
  TouchableOpacity, ImageBackground, StatusBar, Image, ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import {
  Bell, Search, ChevronRight, MapPin, FileText,
  CreditCard, Phone, AlertCircle, TrendingUp,
} from 'lucide-react-native';

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickServices = [
    { id: '1', label: 'Borç Sorgula', icon: CreditCard, color: '#1565C0', bg: '#E3F2FD', route: '/services' },
    { id: '2', label: 'E-Başvuru', icon: FileText, color: '#2E7D32', bg: '#E8F5E9', route: '/services' },
    { id: '3', label: 'Eczaneler', icon: MapPin, color: '#C62828', bg: '#FFEBEE', route: '/services' },
    { id: '4', label: 'İletişim', icon: Phone, color: '#6A1B9A', bg: '#F3E5F5', route: '/services' },
    { id: '5', label: 'Şikayet', icon: AlertCircle, color: '#E65100', bg: '#FFF3E0', route: '/services' },
    { id: '6', label: 'Projeler', icon: TrendingUp, color: '#00695C', bg: '#E0F2F1', route: '/news' },
  ];

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://newsapi.org/v2/everything?q=Alanya+Belediyesi&language=tr&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`);
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        const formatted = data.articles.map((article, index) => ({
          id: index.toString(),
          tag: index % 2 === 0 ? 'DUYURU' : 'GÜNCEL',
          tagColor: index % 2 === 0 ? '#1565C0' : '#E65100',
          title: article.title,
          time: new Date(article.publishedAt).toLocaleDateString('tr-TR'),
          route: '/news'
        }));
        setAnnouncements(formatted);
      } else {
        throw new Error('No data');
      }
    } catch (error) {
      setAnnouncements([
        {
          id: '1',
          tag: 'DUYURU',
          tagColor: '#1565C0',
          title: 'Alanya Kalesi yolu üzerinde 15-18 Mayıs tarihleri arasında trafik düzenlemesi yapılacaktır.',
          time: '2 saat önce',
          route: '/news'
        },
        {
          id: '2',
          tag: 'PROJE',
          tagColor: '#2E7D32',
          title: 'Sahil Düzenleme Projesi kapsamında Damlataş Caddesi yenileme çalışmaları başladı.',
          time: '1 gün önce',
          route: '/news'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerBrand}>
              <View style={styles.emblemCircle}>
                <Image source={require('../assets/images/belediye.png')} style={styles.logo} />
              </View>
              <View>
                <Text style={styles.headerSubtitle}>Hoş Geldiniz</Text>
                <Text style={styles.headerTitle}>Alanya Belediyesi</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/modal')}>
              <Bell size={20} color="#FFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/services')}>
            <Search size={18} color="#90A4AE" />
            <Text style={styles.searchText}>Hizmet veya bilgi arayın...</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <StatItem value="350K+" label="Nüfus" />
            <View style={styles.statDivider} />
            <StatItem value="1.4K km²" label="Yüzölçümü" />
            <View style={styles.statDivider} />
            <StatItem value="120+" label="Hizmet" />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Hızlı Hizmetler" />
          <View style={styles.serviceGrid}>
            {quickServices.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                activeOpacity={0.75}
                onPress={() => router.push(s.route)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: s.bg }]}>
                  <s.icon size={22} color={s.color} strokeWidth={2} />
                </View>
                <Text style={[styles.serviceLabel, { color: theme.text }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ImageBackground
            source={require('../assets/images/alanya_hero.png')}
            style={styles.heroBanner}
            imageStyle={styles.heroBannerImage}
          >
            <View style={styles.heroBannerOverlay}>
              <View style={styles.heroBannerBadge}>
                <Text style={styles.heroBannerBadgeText}>Alanya Rehberi</Text>
              </View>
              <Text style={styles.heroBannerTitle}>Tarihin ve{'\n'}Doğanın Buluştuğu Şehir</Text>
              <TouchableOpacity style={styles.heroBannerBtn} onPress={() => router.push('/discover')}>
                <Text style={styles.heroBannerBtnText}>Keşfet</Text>
                <ChevronRight size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Güncel Duyurular" action="Tümü" onActionPress={() => router.push('/news')} />
          {loading ? (
            <ActivityIndicator color={theme.primary} style={{ marginVertical: 20 }} />
          ) : (
            announcements.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[styles.announcementCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => router.push(a.route)}
              >
                <View style={[styles.announcementAccent, { backgroundColor: a.tagColor }]} />
                <View style={styles.announcementBody}>
                  <View style={[styles.announcementTag, { backgroundColor: a.tagColor + '18' }]}>
                    <Text style={[styles.announcementTagText, { color: a.tagColor }]}>{a.tag}</Text>
                  </View>
                  <Text style={[styles.announcementTitle, { color: theme.text }]} numberOfLines={2}>
                    {a.title}
                  </Text>
                  <View style={styles.announcementFooter}>
                    <Text style={[styles.announcementTime, { color: theme.textSecondary }]}>{a.time}</Text>
                    <ChevronRight size={16} color={theme.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, action, onActionPress }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View style={[styles.sectionAccent, { backgroundColor: theme.primary }]} />
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={[styles.sectionAction, { color: theme.primary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  emblemCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logo: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  headerSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 2 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F9A825',
    borderWidth: 1.5,
    borderColor: '#0B3D91',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchText: { color: '#90A4AE', marginLeft: 10, fontSize: 15 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 4 },
  statValue: { color: '#FFF', fontSize: 17, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '500' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionAccent: { width: 4, height: 18, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  sectionAction: { fontSize: 13, fontWeight: '600' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: {
    width: '31%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  serviceLabel: { fontSize: 11.5, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
  heroBanner: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroBannerImage: { borderRadius: 20 },
  heroBannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,61,145,0.60)',
    padding: 22,
    justifyContent: 'flex-end',
  },
  heroBannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F9A825',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  heroBannerBadgeText: { color: '#1A202C', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroBannerTitle: { color: '#FFF', fontSize: 22, fontWeight: '800', lineHeight: 30, marginBottom: 16 },
  heroBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroBannerBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700', marginRight: 4 },
  announcementCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  announcementAccent: { width: 4 },
  announcementBody: { flex: 1, padding: 16 },
  announcementTag: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  announcementTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  announcementTitle: { fontSize: 14, fontWeight: '600', lineHeight: 21, marginBottom: 10 },
  announcementFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  announcementTime: { fontSize: 12, fontWeight: '500' },
});
