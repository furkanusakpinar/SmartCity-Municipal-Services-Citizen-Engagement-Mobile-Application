import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView,
  Image, TouchableOpacity, StatusBar, FlatList, Linking, Alert
} from 'react-native';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, ChevronRight, Camera } from 'lucide-react-native';

const CATEGORIES = ['Tümü', 'Tarih', 'Doğa', 'Plaj', 'Kültür'];

const FEATURED = [
  {
    id: 'f1',
    title: 'Alanya Kalesi',
    category: 'Tarih',
    rating: 4.9,
    visits: '1.2M',
    image: require('../assets/images/kizilkule.jpg'),
    url: 'https://alanya.bel.tr/Alanya-Kalesi'
  },
  {
    id: 'f2',
    title: 'Kleopatra Plajı',
    category: 'Plaj',
    rating: 4.8,
    visits: '900K',
    image: require('../assets/images/plaj.webp'),
    url: 'https://alanya.bel.tr'
  },
];

const PLACES = [
  { 
    id: '1', 
    title: 'Damlataş Mağarası', 
    category: 'Doğa', 
    rating: 4.7, 
    duration: '1-2 saat', 
    image: require('../assets/images/damlatas.jpg'), 
    url: 'https://alanya.bel.tr' 
  },
  { 
    id: '2', 
    title: 'Kızılkule', 
    category: 'Tarih', 
    rating: 4.6, 
    duration: '30-60 dk', 
    image: require('../assets/images/kizilkule.jpg'), 
    url: 'https://alanya.bel.tr' 
  },
  { 
    id: '3', 
    title: 'Alanya Müzesi', 
    category: 'Kültür', 
    rating: 4.5, 
    duration: '1-2 saat', 
    image: require('../assets/images/alanyamuze.jpg'), 
    url: 'https://alanya.bel.tr' 
  },
  { 
    id: '4', 
    title: 'Dim Çayı', 
    category: 'Doğa', 
    rating: 4.8, 
    duration: 'Yarım gün', 
    image: require('../assets/images/dimcayi.jpg'), 
    url: 'https://alanya.bel.tr' 
  },
  { 
    id: '5', 
    title: 'Alanya Tersanesi', 
    category: 'Tarih', 
    rating: 4.6, 
    duration: '1-2 saat', 
    image: require('../assets/images/tersane.jpg'), 
    url: 'https://alanya.bel.tr' 
  },
];

const CAT_COLORS = {
  Tarih: '#1565C0',
  Doğa: '#2E7D32',
  Plaj: '#0097A7',
  Kültür: '#7B1FA2',
};

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const handlePlacePress = (place) => {
    if (place.url) {
      Linking.openURL(place.url).catch(() => {
        Alert.alert('Bilgi', `${place.title} detayları yakında eklenecektir.`);
      });
    }
  };

  const filtered = activeCategory === 'Tümü'
    ? PLACES
    : PLACES.filter(p => p.category === activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <Text style={styles.headerEyebrow}>Alanya Belediyesi</Text>
          <Text style={styles.headerTitle}>Alanya'yı Keşfet</Text>
          <Text style={styles.headerSubtitle}>Tarih, doğa ve kültürün buluştuğu nokta</Text>
        </View>

        {/* Featured Horizontal */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionRow}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: theme.primary }]} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Öne Çıkanlar</Text>
            </View>
          </View>

          <FlatList
            data={FEATURED}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => {
              const catColor = CAT_COLORS[item.category] || theme.primary;
              return (
                <TouchableOpacity 
                  style={styles.featuredCard} 
                  activeOpacity={0.85}
                  onPress={() => handlePlacePress(item)}
                >
                  <Image source={item.image} style={styles.featuredImage} />
                  <View style={styles.featuredOverlay}>
                    <View style={[styles.catBadge, { backgroundColor: catColor }]}>
                      <Text style={styles.catBadgeText}>{item.category.toUpperCase()}</Text>
                    </View>
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredTitle}>{item.title}</Text>
                      <View style={styles.featuredMeta}>
                        <Star size={13} color="#F9A825" fill="#F9A825" />
                        <Text style={styles.featuredRating}>{item.rating}</Text>
                        <Text style={styles.featuredVisits}> · {item.visits} ziyaret</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.filterChip,
                  activeCategory === cat
                    ? { backgroundColor: theme.primary }
                    : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
                ]}
              >
                {cat !== 'Tümü' && (
                  <View style={[styles.filterDot, { backgroundColor: activeCategory === cat ? '#FFF' : CAT_COLORS[cat] || theme.primary }]} />
                )}
                <Text style={[
                  styles.filterText,
                  { color: activeCategory === cat ? '#FFF' : theme.textSecondary },
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Places List */}
        <View style={styles.placesList}>
          {filtered.map((place) => {
            const catColor = CAT_COLORS[place.category] || theme.primary;
            return (
              <TouchableOpacity
                key={place.id}
                style={[styles.placeCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handlePlacePress(place)}
              >
                <Image source={place.image} style={styles.placeImage} />
                <View style={styles.placeBody}>
                  <View style={[styles.placeCatRow]}>
                    <View style={[styles.placeCatBadge, { backgroundColor: catColor + '15' }]}>
                      <View style={[styles.placeCatDot, { backgroundColor: catColor }]} />
                      <Text style={[styles.placeCatText, { color: catColor }]}>{place.category}</Text>
                    </View>
                  </View>
                  <Text style={[styles.placeTitle, { color: theme.text }]}>{place.title}</Text>
                  <View style={styles.placeMeta}>
                    <View style={styles.placeMetaItem}>
                      <Star size={13} color="#F9A825" fill="#F9A825" />
                      <Text style={[styles.placeMetaText, { color: theme.textSecondary }]}>{place.rating}</Text>
                    </View>
                    <View style={[styles.placeDivider, { backgroundColor: theme.border }]} />
                    <View style={styles.placeMetaItem}>
                      <Clock size={13} color={theme.tabIconDefault} />
                      <Text style={[styles.placeMetaText, { color: theme.textSecondary }]}>{place.duration}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.placeArrow, { backgroundColor: theme.background }]}>
                  <ChevronRight size={18} color={theme.primary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerEyebrow: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', letterSpacing: 0.2, marginBottom: 4 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  featuredSection: { paddingTop: 24, paddingHorizontal: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionAccent: { width: 4, height: 18, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  featuredList: { paddingRight: 20 },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 14,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 16,
    justifyContent: 'space-between',
  },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 7 },
  catBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  featuredInfo: {},
  featuredTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center' },
  featuredRating: { color: '#FFF', fontSize: 13, fontWeight: '700', marginLeft: 4 },
  featuredVisits: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  filterRow: { paddingTop: 20, paddingHorizontal: 20 },
  filterList: { gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 6 },
  filterText: { fontSize: 13, fontWeight: '600' },
  placesList: { padding: 16, paddingTop: 14 },
  placeCard: {
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  placeImage: { width: 100, height: 100 },
  placeBody: { flex: 1, padding: 14 },
  placeCatRow: { marginBottom: 6 },
  placeCatBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  placeCatDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  placeCatText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  placeTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  placeMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  placeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  placeMetaText: { fontSize: 11, fontWeight: '500' },
  placeDivider: { width: 1, height: 10 },
  placeArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
