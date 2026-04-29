import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  Image, TouchableOpacity, StatusBar, ActivityIndicator, Linking
} from 'react-native';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Bookmark, Clock, ChevronRight, AlertCircle } from 'lucide-react-native';

const CATEGORIES = ['Tümü', 'Duyurular', 'Projeler', 'Etkinlikler', 'İhale'];

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY; 

const CATEGORY_COLORS = {
  Duyurular: '#1565C0',
  Projeler: '#2E7D32',
  Etkinlikler: '#7B1FA2',
  İhale: '#E65100',
};

export default function NewsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      if (!NEWS_API_KEY) {
        throw new Error('API_KEY_MISSING');
      }

      const response = await fetch(`https://newsapi.org/v2/everything?q=Alanya&language=tr&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`);
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API Error');
      }

      if (data.articles) {
        const formattedNews = data.articles.map((article, index) => ({
          id: index.toString(),
          category: index % 3 === 0 ? 'Projeler' : (index % 3 === 1 ? 'Duyurular' : 'Etkinlikler'),
          title: article.title,
          summary: article.description || 'Haber detayı için tıklayınız.',
          date: new Date(article.publishedAt).toLocaleDateString('tr-TR'),
          readTime: '3 dk',
          image: article.urlToImage || `https://picsum.photos/600/300?random=${index}`,
          url: article.url,
        }));
        setNews(formattedNews);
      } else {
        throw new Error('No articles');
      }
    } catch (error) {
      setNews([
        {
          id: '1',
          category: 'Projeler',
          title: 'Alanya Kalesi Çevre Düzenlemesi Tamamlanıyor',
          summary: 'Kaledeki tarihi dokuyu koruyarak yürütülen restorasyon ve çevre düzenleme çalışmalarında sona gelindi.',
          date: '29 Nisan 2026',
          readTime: '4 dk',
          image: 'https://images.unsplash.com/photo-1623055977536-1279a955768a?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: '2',
          category: 'Duyurular',
          title: 'Sosyal Yardım Başvuruları Başladı',
          summary: 'İhtiyaç sahibi vatandaşlarımız için hazırlanan bahar dönemi sosyal yardım paketleri başvuruları e-belediye üzerinden alınacak.',
          date: '28 Nisan 2026',
          readTime: '2 dk',
          image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: '3',
          category: 'Etkinlikler',
          title: 'Geleneksel Alanya Gastronomi Festivali',
          summary: 'Yöresel lezzetlerin ve ünlü şeflerin buluşacağı festival bu yıl Mayıs ayında rıhtım bölgesinde yapılacak.',
          date: '27 Nisan 2026',
          readTime: '5 dk',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: '4',
          category: 'İhale',
          title: 'Yeni Belediye Binası İnşaatı İhalesi',
          summary: 'Modern ve çevreci tasarımıyla Alanya\'ya yakışacak yeni hizmet binası için ihale süreci resmen başladı.',
          date: '26 Nisan 2026',
          readTime: '3 dk',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const filtered = activeCategory === 'Tümü'
    ? news
    : news.filter(n => n.category === activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerEyebrow}>Alanya Belediyesi</Text>
        <Text style={styles.headerTitle}>Haberler & Duyurular</Text>
      </View>

      {!NEWS_API_KEY && (
        <TouchableOpacity 
          style={styles.apiWarning}
          onPress={() => Linking.openURL('https://newsapi.org/')}
        >
          <AlertCircle size={16} color="#E65100" />
          <Text style={styles.apiWarningText}>Canlı haberler için NewsAPI anahtarı girin.</Text>
          <ChevronRight size={14} color="#E65100" />
        </TouchableOpacity>
      )}

      <View style={[styles.chipBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item)}
              style={[
                styles.chip,
                activeCategory === item
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 },
              ]}
            >
              <Text style={[
                styles.chipText,
                { color: activeCategory === item ? '#FFF' : theme.textSecondary },
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Haberler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({ item, index }) => {
            const catColor = CATEGORY_COLORS[item.category] || theme.primary;
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => item.url && Linking.openURL(item.url)}
              >
                {index === 0 && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>ÖNCÜ HABER</Text>
                  </View>
                )}
                <Image source={{ uri: item.image }} style={index === 0 ? styles.cardImageLarge : styles.cardImage} />
                <View style={styles.cardBody}>
                  <View style={styles.cardMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: catColor + '15' }]}>
                      <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
                      <Text style={[styles.categoryText, { color: catColor }]}>{item.category}</Text>
                    </View>
                    <TouchableOpacity>
                      <Bookmark size={16} color={theme.tabIconDefault} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardSummary, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.summary}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.cardDateRow}>
                      <Clock size={12} color={theme.tabIconDefault} />
                      <Text style={[styles.cardDate, { color: theme.textSecondary }]}>{item.date}</Text>
                      <Text style={[styles.readTime, { color: theme.primary }]}> · {item.readTime} okuma</Text>
                    </View>
                    <ChevronRight size={16} color={theme.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={{ color: theme.textSecondary }}>Haber bulunamadı.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 14 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerEyebrow: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', letterSpacing: 0.2 },
  
  apiWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  apiWarningText: { flex: 1, color: '#E65100', fontSize: 12, fontWeight: '600', marginLeft: 8 },

  chipBar: { borderBottomWidth: 1, paddingVertical: 12 },
  chipList: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 16, paddingTop: 12 },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 10,
    backgroundColor: '#F9A825',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featuredBadgeText: { fontSize: 10, fontWeight: '800', color: '#1A202C', letterSpacing: 0.8 },
  cardImageLarge: { width: '100%', height: 200 },
  cardImage: { width: '100%', height: 160 },
  cardBody: { padding: 16 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  categoryText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  cardTitle: { fontSize: 16, fontWeight: '700', lineHeight: 23, marginBottom: 6 },
  cardSummary: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDate: { fontSize: 12, fontWeight: '500', marginLeft: 4 },
  readTime: { fontSize: 12, fontWeight: '600' },
});
