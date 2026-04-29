import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView,
  TouchableOpacity, StatusBar, Alert, Linking
} from 'react-native';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import {
  CreditCard, FileText, MapPin, Phone,
  MessageSquare, HelpCircle, Building2,
  Truck, Leaf, Waves, ShieldCheck, Globe,
  ChevronRight,
} from 'lucide-react-native';

const SERVICE_GROUPS = [
  {
    groupTitle: 'Mali Hizmetler',
    groupIcon: CreditCard,
    groupColor: '#1565C0',
    services: [
      { id: '1', label: 'Borç Sorgulama', icon: CreditCard, desc: 'Vergi & harç borçlarınızı görün', url: 'https://alanya.bel.tr/E-Belediye' },
      { id: '2', label: 'Beyan & Ödeme', icon: FileText, desc: 'Online ödeme ve beyan işlemleri', url: 'https://alanya.bel.tr/E-Belediye' },
    ],
  },
  {
    groupTitle: 'Şehir Hizmetleri',
    groupIcon: Building2,
    groupColor: '#2E7D32',
    services: [
      { id: '3', label: 'İmar Durumu', icon: Building2, desc: 'Parsel imar bilgisi sorgulama', url: 'https://alanya.bel.tr/Imar-Sorgulama' },
      { id: '4', label: 'Atık Toplama', icon: Truck, desc: 'Geri dönüşüm & takvim bilgisi', url: 'https://www.alanya.bel.tr/Hizmetler/Temizlik-Isleri-Mudurlugu' },
      { id: '5', label: 'Yeşil Alan', icon: Leaf, desc: 'Park ve bahçe hizmetleri', url: 'https://www.alanya.bel.tr/Hizmetler/Park-ve-Bahceler-Mudurlugu' },
    ],
  },
  {
    groupTitle: 'Sağlık & Acil',
    groupIcon: ShieldCheck,
    groupColor: '#C62828',
    services: [
      { id: '6', label: 'Nöbetçi Eczane', icon: MapPin, desc: 'Anlık nöbetçi eczane bilgisi', url: 'https://www.alanya.bel.tr/Nobetci-Eczaneler' },
      { id: '7', label: 'Sahil Güvenlik', icon: Waves, desc: 'Sahil noktaları & güvenlik', url: 'https://www.alanya.bel.tr/S/H/DENIZ-ZABITASI' },
    ],
  },
  {
    groupTitle: 'İletişim & Destek',
    groupIcon: Phone,
    groupColor: '#6A1B9A',
    services: [
      { id: '8', label: 'İstek & Şikayet', icon: MessageSquare, desc: 'Görüş ve şikayetlerinizi iletin', url: 'https://alanya.bel.tr/Cozum-Masasi' },
      { id: '9', label: 'İletişim', icon: Phone, desc: 'Tüm birimlerimizle iletişim', url: 'tel:4449032' },
      { id: '10', label: 'Uluslararası', icon: Globe, desc: 'Yabancı uyruklu işlemleri', url: 'https://www.alanya.bel.tr/S/H/Yabancilar-Meclisi' },
      { id: '11', label: 'SSS', icon: HelpCircle, desc: 'Sık sorulan sorular', url: 'https://alanya.bel.tr' },
    ],
  },
];

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [expanded, setExpanded] = useState(null);
  const router = useRouter();

  const handleServicePress = (service) => {
    if (service.url) {
      if (service.url.startsWith('tel:')) {
        Linking.openURL(service.url);
      } else {
        // Expo WebBrowser veya normal Linking kullanılabilir. 
        // Kullanıcı tüm butonların çalışmasını istediği için dış linke yönlendiriyoruz.
        Linking.openURL(service.url).catch(err => {
          Alert.alert('Hata', 'Bağlantı açılamadı.');
        });
      }
    } else {
      Alert.alert('Bilgi', `${service.label} hizmeti yakında aktif edilecektir.`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerEyebrow}>Alanya Belediyesi</Text>
        <Text style={styles.headerTitle}>E-Belediye Hizmetleri</Text>
        <Text style={styles.headerSubtitle}>
          Tüm belediye hizmetlerine dijital ortamdan hızlıca ulaşın.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Emergency Banner */}
        <TouchableOpacity 
          style={styles.emergencyBanner} 
          activeOpacity={0.85}
          onPress={() => Linking.openURL('tel:02425110000')}
        >
          <View style={styles.emergencyLeft}>
            <ShieldCheck size={24} color="#FFF" />
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>Acil Yardım Hattı</Text>
              <Text style={styles.emergencyNumber}>0 242 511 00 00</Text>
            </View>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* Service Groups */}
        {SERVICE_GROUPS.map((group) => (
          <View key={group.groupTitle} style={styles.groupSection}>
            {/* Group Header */}
            <TouchableOpacity
              style={[styles.groupHeader, { backgroundColor: group.groupColor }]}
              onPress={() => setExpanded(expanded === group.groupTitle ? null : group.groupTitle)}
              activeOpacity={0.85}
            >
              <View style={styles.groupHeaderLeft}>
                <View style={styles.groupIconCircle}>
                  <group.groupIcon size={20} color="#FFF" />
                </View>
                <Text style={styles.groupTitle}>{group.groupTitle}</Text>
              </View>
              <View style={styles.groupBadge}>
                <Text style={styles.groupBadgeText}>{group.services.length}</Text>
              </View>
            </TouchableOpacity>

            {/* Service Items */}
            <View style={[styles.serviceList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {group.services.map((service, idx) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceItem,
                    idx < group.services.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleServicePress(service)}
                >
                  <View style={[styles.serviceIconBox, { backgroundColor: group.groupColor + '15' }]}>
                    <service.icon size={20} color={group.groupColor} strokeWidth={2} />
                  </View>
                  <View style={styles.serviceContent}>
                    <Text style={[styles.serviceName, { color: theme.text }]}>{service.label}</Text>
                    <Text style={[styles.serviceDesc, { color: theme.textSecondary }]}>{service.desc}</Text>
                  </View>
                  <ChevronRight size={18} color={theme.tabIconDefault} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

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
    paddingBottom: 24,
  },
  headerEyebrow: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', letterSpacing: 0.2, marginBottom: 6 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20 },
  scrollContent: { padding: 16 },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C62828',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  emergencyLeft: { flexDirection: 'row', alignItems: 'center' },
  emergencyText: { marginLeft: 14 },
  emergencyTitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  emergencyNumber: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  groupSection: { marginBottom: 16 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  groupHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  groupIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupTitle: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  groupBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  groupBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  serviceList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceContent: { flex: 1 },
  serviceName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  serviceDesc: { fontSize: 12, lineHeight: 17 },
});
