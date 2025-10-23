import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, Shield, Target, MapPin, Calendar, Leaf, Info, Wrench, TrendingUp, Search, Eye } from 'lucide-react';
import SimpleHeader from '../components/SimpleHeader';
import { getSpeciesByName, ProcessedSpeciesData } from '../utils/speciesData';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

interface SpeciesDetail {
  name: string;
  scientificName: string;
  type: string;
  nativeRange: string;
  firstDetected: string;
  impact: string;
  spread: string;
  risk: string;
  description: string;
  controlMethods: string[];
  economicImpact: string;
  ecologicalImpact: string;
  managementStrategies: string[];
  preventionTips: string[];
  identification: string[];
  seasonalBehavior: string;
  habitat: string;
  reproduction: string;
  distribution: string;
  legalStatus: string;
  reporting: string;
}

const SpeciesDetailPage: React.FC = () => {
  const { speciesName } = useParams<{ speciesName: string }>();
  const navigate = useNavigate();
  const [species, setSpecies] = useState<SpeciesDetail | null>(null);
  const [csvSpeciesData, setCsvSpeciesData] = useState<ProcessedSpeciesData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  // Check if user came from map or species profile page
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from');
  console.log('SpeciesDetailPage - fromPage:', fromPage, 'URL:', window.location.href);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const parallaxElements = parallaxRef.current.querySelectorAll('.parallax-element');
        parallaxElements.forEach((element, index) => {
          const speed = 0.3 + (index * 0.1);
          (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get species image - dynamic generation based on species name
  const getSpeciesImage = (speciesName: string) => {
    // Generate image path based on species name
    const cleanName = speciesName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    const imagePath = `/top10/${cleanName}.png`;
    
    console.log(`Loading image for ${speciesName}: ${imagePath}`);
    return imagePath;
  };

  // Convert URL parameter back to readable species name
  const getSpeciesNameFromUrl = (urlName: string) => {
    return urlName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get species data based on name
  const getSpeciesData = (name: string): SpeciesDetail => {
    const speciesData: Record<string, SpeciesDetail> = {
      'lantana': {
        name: 'Lantana',
        scientificName: 'Lantana camara',
        type: 'Shrub',
        nativeRange: 'Tropical America (Central and South America)',
        firstDetected: 'Early 1900s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Lantana is a highly invasive shrub that forms dense thickets, outcompeting native vegetation and altering ecosystem functions. It produces toxic berries that can harm livestock and wildlife.',
        controlMethods: [
          'Mechanical removal: Cut and remove plants, ensuring all roots are extracted',
          'Herbicide application: Use approved herbicides during active growth periods',
          'Fire management: Controlled burns can help reduce seed banks',
          'Biological control: Introduction of specific insects that feed on Lantana',
          'Physical barriers: Prevent spread by creating buffer zones'
        ],
        economicImpact: 'Lantana causes significant economic losses in agriculture, forestry, and pastoral industries. It reduces pasture productivity, increases management costs, and can make land unsuitable for livestock grazing.',
        ecologicalImpact: 'Forms dense monocultures that displace native plant species, reduce biodiversity, alter soil chemistry, and change fire regimes. It affects native fauna by reducing food sources and habitat quality.',
        managementStrategies: [
          'Early detection and rapid response programs',
          'Integrated weed management approaches',
          'Community education and awareness campaigns',
          'Regular monitoring and assessment',
          'Collaboration with neighboring landowners'
        ],
        preventionTips: [
          'Clean vehicles and equipment before moving between areas',
          'Avoid planting Lantana in gardens or landscapes',
          'Report new infestations immediately',
          'Maintain healthy native vegetation',
          'Use certified weed-free materials'
        ],
        identification: [
          'Multi-colored flowers (yellow, orange, pink, red)',
          'Rough, hairy leaves with serrated edges',
          'Green berries that turn black when ripe',
          'Square stems with small prickles',
          'Distinctive aromatic smell when crushed'
        ],
        seasonalBehavior: 'Flowers year-round in warm climates, with peak flowering in spring and summer. Seeds germinate after rainfall events.',
        habitat: 'Thrives in disturbed areas, roadsides, pastures, forests, and coastal regions. Prefers full sun but can tolerate partial shade.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by birds, animals, and water. Can regenerate from root fragments.',
        distribution: 'Widespread across northern and eastern Australia, particularly in Queensland, New South Wales, and Northern Territory.',
        legalStatus: 'Declared noxious weed in most Australian states. Landowners are legally required to control infestations.',
        reporting: 'Report new infestations to your local council or state biosecurity authority. Include photos and GPS coordinates if possible.'
      },
      'bitou-bush': {
        name: 'Bitou Bush',
        scientificName: 'Chrysanthemoides monilifera',
        type: 'Shrub',
        nativeRange: 'South Africa',
        firstDetected: '1908',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Bitou Bush is a fast-growing coastal shrub that forms dense thickets, displacing native vegetation and threatening coastal ecosystems. It can dominate large areas and alter natural fire regimes.',
        controlMethods: [
          'Mechanical removal: Cut and remove plants with complete root extraction',
          'Herbicide application: Use approved herbicides during active growth',
          'Fire management: Controlled burns to reduce seed banks',
          'Biological control: Introduction of specific insects and pathogens',
          'Physical barriers: Prevent spread through buffer zones and fencing'
        ],
        economicImpact: 'Significant costs in coastal management, tourism, and biodiversity conservation. Reduces property values and increases fire management costs.',
        ecologicalImpact: 'Forms dense monocultures that exclude native species, reduces biodiversity, alters soil chemistry, and changes fire frequency and intensity.',
        managementStrategies: [
          'Coastal weed management programs',
          'Community-based control initiatives',
          'Regular monitoring and early intervention',
          'Habitat restoration programs',
          'Public education and awareness campaigns'
        ],
        preventionTips: [
          'Prevent seed spread on vehicles and equipment',
          'Maintain healthy native coastal vegetation',
          'Avoid planting Bitou Bush in gardens',
          'Report new infestations immediately',
          'Support community control programs'
        ],
        identification: [
          'Bright yellow daisy-like flowers',
          'Glossy green leaves with serrated edges',
          'Dense, spreading growth habit',
          'Black berries that persist on plants',
          'Prefers coastal and near-coastal areas'
        ],
        seasonalBehavior: 'Flowers primarily in autumn and winter. Seeds germinate after rainfall and can remain viable for several years.',
        habitat: 'Coastal areas, dunes, headlands, and near-coastal regions. Prefers well-drained soils and full sun exposure.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by birds, animals, water, and human activities.',
        distribution: 'Widespread along the eastern coast of Australia, particularly in New South Wales and Queensland.',
        legalStatus: 'Declared noxious weed in most Australian states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local coastal authorities or state biosecurity agencies.'
      },
      'eucalyptus': {
        name: 'Eucalyptus',
        scientificName: 'Eucalyptus spp.',
        type: 'Tree',
        nativeRange: 'Australia',
        firstDetected: 'Native',
        impact: 'Beneficial',
        spread: 'Natural',
        risk: 'Low',
        description: 'Eucalyptus trees are iconic Australian natives that form the backbone of many ecosystems. They provide essential habitat, food, and environmental services.',
        controlMethods: [
          'No control needed: Eucalyptus are native and beneficial',
          'Conservation: Protect existing trees and their ecosystems',
          'Restoration: Plant native eucalypts in appropriate areas',
          'Management: Prune for safety while maintaining ecological value',
          'Education: Learn about local eucalyptus species and their benefits'
        ],
        economicImpact: 'Eucalyptus provide significant economic benefits through timber production, honey production, tourism, and ecosystem services like carbon storage.',
        ecologicalImpact: 'Essential for native wildlife, providing food, shelter, and nesting sites. Eucalyptus forests support diverse ecosystems and help maintain soil health.',
        managementStrategies: [
          'Conservation of existing populations',
          'Restoration of degraded eucalyptus forests',
          'Protection from invasive species',
          'Sustainable harvesting practices',
          'Community education and engagement'
        ],
        preventionTips: [
          'Plant native eucalyptus species in your garden',
          'Avoid removing healthy native trees',
          'Support local conservation efforts',
          'Learn to identify local species',
          'Protect trees from invasive weeds'
        ],
        identification: [
          'Variable leaf shapes (lanceolate to ovate)',
          'Distinctive bark patterns and textures',
          'Unique flower structures with prominent stamens',
          'Distinctive eucalyptus aroma',
          'Capsule fruits that open to release seeds'
        ],
        seasonalBehavior: 'Flowering varies by species, with many flowering in winter and spring. Seed dispersal occurs after capsule opening.',
        habitat: 'Adaptable to various Australian environments including forests, woodlands, and coastal areas.',
        reproduction: 'Reproduces by seed. Many species require fire for optimal seed germination and regeneration.',
        distribution: 'Throughout Australia in diverse habitats from coastal regions to inland areas.',
        legalStatus: 'Protected native species in most areas. Removal may require permits.',
        reporting: 'Report illegal removal or damage to native vegetation authorities. Share sightings of rare species with conservation groups.'
      },
      'gorse': {
        name: 'Gorse',
        scientificName: 'Ulex europaeus',
        type: 'Shrub',
        nativeRange: 'Western Europe and North Africa',
        firstDetected: 'Mid-1800s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Gorse is a dense, spiny shrub that forms impenetrable thickets. It competes aggressively with native vegetation and can dominate large areas, making them inaccessible to humans and animals.',
        controlMethods: [
          'Mechanical control: Cut and remove plants, ensuring complete root removal',
          'Herbicide treatment: Apply during active growth, preferably in spring',
          'Fire management: Controlled burns can reduce seed banks',
          'Biological control: Use specific weevils and moths',
          'Grazing management: Strategic grazing by goats can help control growth'
        ],
        economicImpact: 'Gorse significantly reduces agricultural productivity, increases management costs, and can make land unusable for farming or grazing. It also increases fire risk and firefighting costs.',
        ecologicalImpact: 'Forms dense monocultures that exclude native species, reduces biodiversity, alters soil chemistry, and increases fire frequency and intensity.',
        managementStrategies: [
          'Integrated weed management programs',
          'Regular monitoring and early intervention',
          'Community-based control initiatives',
          'Fire prevention and management',
          'Restoration of native vegetation'
        ],
        preventionTips: [
          'Prevent seed spread on vehicles and equipment',
          'Maintain healthy native vegetation cover',
          'Avoid planting Gorse in gardens',
          'Report new infestations immediately',
          'Use certified weed-free materials'
        ],
        identification: [
          'Bright yellow pea-like flowers',
          'Sharp, spiny leaves and stems',
          'Dense, impenetrable growth habit',
          'Green seed pods that turn black',
          'Distinctive coconut-like smell when flowering'
        ],
        seasonalBehavior: 'Flowers primarily in winter and spring, with some flowering year-round. Seeds germinate after fire or soil disturbance.',
        habitat: 'Prefers acidic soils, full sun, and disturbed areas. Common in pastures, roadsides, and coastal regions.',
        reproduction: 'Reproduces by seed, which can remain viable in soil for up to 30 years. Seeds are dispersed by animals, water, and human activities.',
        distribution: 'Widespread in southern Australia, particularly in Victoria, Tasmania, and parts of New South Wales.',
        legalStatus: 'Declared noxious weed in most Australian states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local authorities. Include location details and photos for proper assessment.'
      },
      'buffel-grass': {
        name: 'Buffel Grass',
        scientificName: 'Cenchrus ciliaris',
        type: 'Grass',
        nativeRange: 'Africa and Asia',
        firstDetected: '1870s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Buffel Grass is a highly invasive grass that forms dense stands, displacing native vegetation and altering fire regimes. It can dominate large areas and reduce biodiversity.',
        controlMethods: [
          'Mechanical removal: Mowing and cultivation during active growth',
          'Herbicide application: Use approved herbicides during growth periods',
          'Fire management: Controlled burns to reduce biomass',
          'Grazing management: Strategic grazing to reduce seed production',
          'Physical barriers: Prevent spread through buffer zones'
        ],
        economicImpact: 'Significant costs in pastoral management, biodiversity conservation, and fire management. Can reduce pasture quality and increase management costs.',
        ecologicalImpact: 'Forms dense monocultures that exclude native species, reduces biodiversity, alters soil chemistry, and increases fire frequency and intensity.',
        managementStrategies: [
          'Integrated weed management programs',
          'Regular monitoring and early intervention',
          'Community-based control initiatives',
          'Habitat restoration programs',
          'Fire prevention and management'
        ],
        preventionTips: [
          'Prevent seed spread on vehicles and equipment',
          'Maintain healthy native vegetation cover',
          'Avoid planting Buffel Grass in gardens',
          'Report new infestations immediately',
          'Use certified weed-free materials'
        ],
        identification: [
          'Tufted perennial grass with fine leaves',
          'Pink to purple flower heads',
          'Dense growth habit forming mats',
          'Seeds with bristly appendages',
          'Prefers sandy soils and full sun'
        ],
        seasonalBehavior: 'Grows actively during warm months, with peak growth in spring and summer. Seeds germinate after rainfall events.',
        habitat: 'Arid and semi-arid regions, sandy soils, roadsides, and disturbed areas. Prefers full sun and well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind, animals, water, and human activities.',
        distribution: 'Widespread across northern and central Australia, particularly in Queensland, Northern Territory, and Western Australia.',
        legalStatus: 'Declared noxious weed in most Australian states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local authorities or state biosecurity agencies.'
      },
      'melaleuca': {
        name: 'Melaleuca',
        scientificName: 'Melaleuca spp.',
        type: 'Tree/Shrub',
        nativeRange: 'Australia',
        firstDetected: 'Native',
        impact: 'Beneficial',
        spread: 'Natural',
        risk: 'Low',
        description: 'Melaleuca species are important Australian natives that provide essential habitat and food for native wildlife. They are known for their papery bark and aromatic oils.',
        controlMethods: [
          'No control needed: Melaleuca are native and beneficial',
          'Conservation: Protect existing populations and ecosystems',
          'Restoration: Plant native melaleuca species in appropriate areas',
          'Management: Prune for safety while maintaining ecological value',
          'Education: Learn about local melaleuca species and their benefits'
        ],
        economicImpact: 'Melaleuca provide economic benefits through essential oils (tea tree oil), timber, honey production, and ecosystem services.',
        ecologicalImpact: 'Essential for wetland ecosystems, provide habitat and food for native wildlife, and help maintain water quality through filtration.',
        managementStrategies: [
          'Conservation of existing populations',
          'Restoration of degraded melaleuca wetlands',
          'Protection from invasive species',
          'Sustainable harvesting practices',
          'Community education and engagement'
        ],
        preventionTips: [
          'Plant native melaleuca species in your garden',
          'Avoid removing healthy native trees',
          'Support local conservation efforts',
          'Learn to identify local species',
          'Protect trees from invasive weeds'
        ],
        identification: [
          'Papery bark that peels in strips',
          'Small white or cream bottlebrush flowers',
          'Narrow, aromatic leaves',
          'Variable growth forms from shrubs to large trees',
          'Distinctive seed capsules'
        ],
        seasonalBehavior: 'Flowering varies by species, with many flowering in spring and summer. Seeds are released after fire or capsule opening.',
        habitat: 'Common in wetlands, swamps, and coastal areas. Some species are highly drought tolerant.',
        reproduction: 'Reproduces by seed. Many species require fire for optimal seed release and germination.',
        distribution: 'Throughout Australia with high diversity in coastal and wetland areas.',
        legalStatus: 'Protected native species in most areas. Removal may require permits.',
        reporting: 'Report illegal removal or damage to native vegetation authorities. Share sightings of rare species with conservation groups.'
      },
      'banksia': {
        name: 'Banksia',
        scientificName: 'Banksia spp.',
        type: 'Tree/Shrub',
        nativeRange: 'Australia',
        firstDetected: 'Native',
        impact: 'Beneficial',
        spread: 'Natural',
        risk: 'Low',
        description: 'Banksia species are iconic Australian natives with distinctive flower spikes that provide essential food for native birds and mammals. They are vital for ecosystem health.',
        controlMethods: [
          'No control needed: Banksia are native and beneficial',
          'Conservation: Protect existing populations and ecosystems',
          'Restoration: Plant native banksia species in appropriate areas',
          'Management: Prune for safety while maintaining ecological value',
          'Education: Learn about local banksia species and their benefits'
        ],
        economicImpact: 'Banksia provide economic benefits through honey production, cut flowers, and ecotourism. They support pollinator populations essential for agriculture.',
        ecologicalImpact: 'Critical food source for native birds and mammals, provide habitat and nesting sites, and support diverse pollinator communities.',
        managementStrategies: [
          'Conservation of existing populations',
          'Restoration of degraded banksia woodlands',
          'Protection from invasive species',
          'Sustainable harvesting practices',
          'Community education and engagement'
        ],
        preventionTips: [
          'Plant native banksia species in your garden',
          'Avoid removing healthy native trees',
          'Support local conservation efforts',
          'Learn to identify local species',
          'Protect trees from invasive weeds'
        ],
        identification: [
          'Distinctive cylindrical flower spikes',
          'Serrated or entire leaves with prominent veins',
          'Cone-like fruiting structures',
          'Variable growth forms from ground covers to large trees',
          'Distinctive bark patterns and textures'
        ],
        seasonalBehavior: 'Flowering varies by species, with many flowering in autumn and winter when nectar is scarce for wildlife.',
        habitat: 'Adaptable to various Australian environments including heathlands, woodlands, forests, and coastal areas.',
        reproduction: 'Reproduces by seed. Many species require fire for seed release and optimal germination.',
        distribution: 'Throughout Australia with high diversity in Western Australia and eastern coastal regions.',
        legalStatus: 'Protected native species in most areas. Removal may require permits.',
        reporting: 'Report illegal removal or damage to native vegetation authorities. Share sightings of rare species with conservation groups.'
      },
      'gamba-grass': {
        name: 'Gamba Grass',
        scientificName: 'Andropogon gayanus',
        type: 'Grass',
        nativeRange: 'Africa',
        firstDetected: '1930s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Gamba Grass is a highly invasive grass that can grow up to 4 meters tall, forming dense stands that displace native vegetation and significantly increase fire risk.',
        controlMethods: [
          'Mechanical control: Mowing and cultivation during growth',
          'Herbicide application: Use approved herbicides during active growth',
          'Fire management: Controlled burns to reduce biomass',
          'Grazing management: Strategic grazing to reduce seed production',
          'Physical barriers: Prevent spread through buffer zones'
        ],
        economicImpact: 'Significant costs in pastoral management, fire management, and biodiversity conservation. Can make land unusable for agriculture and increase firefighting costs.',
        ecologicalImpact: 'Forms dense monocultures that exclude native species, reduces biodiversity, alters soil chemistry, and significantly increases fire frequency and intensity.',
        managementStrategies: [
          'Integrated weed management programs',
          'Regular monitoring and early intervention',
          'Community-based control initiatives',
          'Fire prevention and management',
          'Habitat restoration programs'
        ],
        preventionTips: [
          'Prevent seed spread on vehicles and equipment',
          'Maintain healthy native vegetation cover',
          'Avoid planting Gamba Grass in gardens',
          'Report new infestations immediately',
          'Use certified weed-free materials'
        ],
        identification: [
          'Tall grass growing up to 4 meters',
          'Large, fluffy seed heads',
          'Broad leaves with prominent midrib',
          'Dense growth habit forming thickets',
          'Prefers wetter areas and disturbed sites'
        ],
        seasonalBehavior: 'Grows actively during wet seasons, with peak growth in summer and autumn. Seeds germinate after rainfall events.',
        habitat: 'Prefers wetter areas, floodplains, and disturbed sites. Common in northern Australia and areas with higher rainfall.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind, animals, water, and human activities.',
        distribution: 'Widespread across northern Australia, particularly in Queensland and Northern Territory.',
        legalStatus: 'Declared noxious weed in most Australian states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local authorities or state biosecurity agencies.'
      },
      'acacia-wattle': {
        name: 'Acacia/Wattle',
        scientificName: 'Acacia spp.',
        type: 'Tree/Shrub',
        nativeRange: 'Australia',
        firstDetected: 'Native',
        impact: 'Beneficial',
        spread: 'Natural',
        risk: 'Low',
        description: 'Acacia (Wattle) species are vital Australian natives that fix nitrogen in soil and provide essential food and habitat for native wildlife. They are Australia\'s floral emblem.',
        controlMethods: [
          'No control needed: Acacia are native and beneficial',
          'Conservation: Protect existing populations and ecosystems',
          'Restoration: Plant native acacia species in appropriate areas',
          'Management: Prune for safety while maintaining ecological value',
          'Education: Learn about local acacia species and their benefits'
        ],
        economicImpact: 'Acacia provide economic benefits through timber, tannins, gum arabic, and ecosystem services. They improve soil fertility through nitrogen fixation.',
        ecologicalImpact: 'Essential for soil health through nitrogen fixation, provide food and habitat for native wildlife, and support diverse ecosystems.',
        managementStrategies: [
          'Conservation of existing populations',
          'Restoration of degraded acacia woodlands',
          'Protection from invasive species',
          'Sustainable harvesting practices',
          'Community education and engagement'
        ],
        preventionTips: [
          'Plant native acacia species in your garden',
          'Avoid removing healthy native trees',
          'Support local conservation efforts',
          'Learn to identify local species',
          'Protect trees from invasive weeds'
        ],
        identification: [
          'Compound leaves (phyllodes in many species)',
          'Golden yellow flower balls or spikes',
          'Pod-like fruits that split open',
          'Variable growth forms from shrubs to large trees',
          'Distinctive bark patterns and textures'
        ],
        seasonalBehavior: 'Many species flower in winter and spring, providing important nectar sources when other plants are dormant.',
        habitat: 'Adaptable to diverse Australian environments including woodlands, forests, grasslands, and coastal areas.',
        reproduction: 'Reproduces by seed. Many species require fire or scarification for optimal seed germination.',
        distribution: 'Throughout Australia in various habitats, with high diversity in arid and semi-arid regions.',
        legalStatus: 'Protected native species in most areas. Removal may require permits.',
        reporting: 'Report illegal removal or damage to native vegetation authorities. Share sightings of rare species with conservation groups.'
      },
      'grevillea': {
        name: 'Grevillea',
        scientificName: 'Grevillea spp.',
        type: 'Tree/Shrub',
        nativeRange: 'Australia',
        firstDetected: 'Native',
        impact: 'Beneficial',
        spread: 'Natural',
        risk: 'Low',
        description: 'Grevillea species are beautiful Australian natives with distinctive flowers that attract native birds and insects. They are excellent garden plants and provide important ecosystem services.',
        controlMethods: [
          'No control needed: Grevillea are native and beneficial',
          'Conservation: Protect existing populations and ecosystems',
          'Restoration: Plant native grevillea species in appropriate areas',
          'Management: Prune for safety while maintaining ecological value',
          'Education: Learn about local grevillea species and their benefits'
        ],
        economicImpact: 'Grevillea provide economic benefits through horticulture, cut flowers, and ecotourism. They attract beneficial insects and birds to gardens.',
        ecologicalImpact: 'Essential for native bird and insect populations, provide habitat and food sources, and support diverse pollinator communities.',
        managementStrategies: [
          'Conservation of existing populations',
          'Restoration of degraded grevillea habitats',
          'Protection from invasive species',
          'Sustainable cultivation practices',
          'Community education and engagement'
        ],
        preventionTips: [
          'Plant native grevillea species in your garden',
          'Avoid removing healthy native plants',
          'Support local conservation efforts',
          'Learn to identify local species',
          'Protect plants from invasive weeds'
        ],
        identification: [
          'Distinctive spider-like or toothbrush flower clusters',
          'Variable leaf shapes from simple to deeply divided',
          'Flowers in various colors (red, pink, yellow, orange)',
          'Variable growth forms from ground covers to small trees',
          'Distinctive seed pods'
        ],
        seasonalBehavior: 'Flowering varies by species, with many flowering in winter and spring when other nectar sources are scarce.',
        habitat: 'Adaptable to various Australian environments including heathlands, woodlands, forests, and coastal areas.',
        reproduction: 'Reproduces by seed. Many species are bird-pollinated and have specialized seed dispersal mechanisms.',
        distribution: 'Throughout Australia with high diversity in Western Australia and eastern coastal regions.',
        legalStatus: 'Protected native species in most areas. Removal may require permits.',
        reporting: 'Report illegal removal or damage to native vegetation authorities. Share sightings of rare species with conservation groups.'
      },
      // Animal species
      'common-myna': {
        name: 'Common Myna',
        scientificName: 'Acridotheres tristis',
        type: 'Bird',
        nativeRange: 'South Asia',
        firstDetected: '1862',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Common Mynas are highly adaptable birds that compete aggressively with native species for food and nesting sites. They can displace native birds and spread diseases.',
        controlMethods: [
          'Habitat modification: Remove food sources and nesting sites',
          'Exclusion methods: Install bird-proofing on buildings',
          'Trapping programs: Use approved trapping methods',
          'Community education: Reduce feeding and nesting opportunities',
          'Monitoring and assessment: Track population changes'
        ],
        economicImpact: 'Costs associated with damage to crops, property damage, and impacts on native biodiversity. Can affect tourism and agricultural productivity.',
        ecologicalImpact: 'Competes with native birds for resources, displaces native species, spreads diseases, and can alter ecosystem dynamics.',
        managementStrategies: [
          'Urban bird management programs',
          'Community education and awareness',
          'Habitat modification and exclusion',
          'Population monitoring and control',
          'Collaboration with local authorities'
        ],
        preventionTips: [
          'Avoid feeding birds in urban areas',
          'Secure garbage and food waste',
          'Modify buildings to prevent nesting',
          'Report large populations to authorities',
          'Support native bird conservation'
        ],
        identification: [
          'Brown body with black head and yellow eye patch',
          'Yellow legs and bill',
          'White patches on wings visible in flight',
          'Aggressive behavior towards other birds',
          'Loud, varied calls and mimicry abilities'
        ],
        seasonalBehavior: 'Active year-round, with increased breeding activity in spring and summer. More visible during feeding times.',
        habitat: 'Urban areas, agricultural lands, parks, and gardens. Prefers areas with food sources and nesting opportunities.',
        reproduction: 'Breed multiple times per year, laying 3-6 eggs per clutch. Can raise several broods annually.',
        distribution: 'Widespread across eastern Australia, particularly in urban and agricultural areas.',
        legalStatus: 'Declared pest animal in most Australian states. Control programs are actively managed.',
        reporting: 'Report large populations or unusual behavior to local authorities or wildlife agencies.'
      },
      'european-rabbit': {
        name: 'European Rabbit',
        scientificName: 'Oryctolagus cuniculus',
        type: 'Mammal',
        nativeRange: 'Europe and North Africa',
        firstDetected: '1788',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'European Rabbits are highly destructive herbivores that cause extensive damage to native vegetation and contribute to soil erosion. They can rapidly increase in numbers and dominate landscapes.',
        controlMethods: [
          'Biological control: Use RHDV virus and myxomatosis',
          'Warren destruction: Ripping and fumigation of burrows',
          'Exclusion fencing: Protect sensitive areas',
          'Trapping and shooting: Professional control programs',
          'Habitat modification: Remove food sources and shelter'
        ],
        economicImpact: 'Significant costs in agricultural damage, land degradation, and control programs. Can make land unsuitable for farming and grazing.',
        ecologicalImpact: 'Overgraze native vegetation, cause soil erosion, compete with native herbivores, and can significantly alter ecosystem structure and function.',
        managementStrategies: [
          'Integrated pest management programs',
          'Community education and awareness',
          'Habitat protection and restoration',
          'Regular monitoring and assessment',
          'Collaboration with neighboring landowners'
        ],
        preventionTips: [
          'Prevent accidental transport of rabbits',
          'Secure livestock and crops',
          'Report large populations to authorities',
          'Support native wildlife conservation',
          'Learn to identify rabbit signs and damage'
        ],
        identification: [
          'Grey-brown fur with white underside',
          'Long ears and powerful hind legs',
          'White tail with dark upper surface',
          'Adult size 35-45cm body length',
          'Distinctive tracks and warrens'
        ],
        seasonalBehavior: 'Most active at dawn and dusk, with increased breeding activity in spring and summer. More visible during cooler months.',
        habitat: 'Adaptable to various environments including agricultural lands, grasslands, forests, and urban areas.',
        reproduction: 'Highly reproductive, can produce multiple litters per year with 4-8 young per litter.',
        distribution: 'Widespread across Australia, particularly in agricultural and pastoral areas.',
        legalStatus: 'Declared pest animal in most Australian states. Control programs are actively managed.',
        reporting: 'Report large populations and damage to local authorities or agricultural agencies.'
      },
      'red-fox': {
        name: 'Red Fox',
        scientificName: 'Vulpes vulpes',
        type: 'Mammal',
        nativeRange: 'Europe, Asia, and North America',
        firstDetected: '1855',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Red Foxes are highly adaptable predators that pose a serious threat to native wildlife. They prey on native mammals, birds, and reptiles, and can significantly impact biodiversity.',
        controlMethods: [
          'Baiting programs: Use approved poisons in strategic locations',
          'Trapping and shooting: Professional control programs',
          'Exclusion fencing: Protect sensitive areas',
          'Habitat modification: Remove food sources and shelter',
          'Community education: Reduce food availability'
        ],
        economicImpact: 'Significant costs in livestock protection, biodiversity conservation, and control programs. Can affect agricultural productivity and tourism.',
        ecologicalImpact: 'Prey on native species, compete with native predators, spread diseases, and can significantly reduce populations of native wildlife.',
        managementStrategies: [
          'Integrated pest management programs',
          'Community education and awareness',
          'Habitat protection and restoration',
          'Regular monitoring and assessment',
          'Collaboration with neighboring landowners'
        ],
        preventionTips: [
          'Secure livestock and poultry at night',
          'Remove food sources and garbage',
          'Report sightings to authorities',
          'Support native wildlife conservation',
          'Learn to identify fox signs and tracks'
        ],
        identification: [
          'Reddish-brown fur with white underside',
          'Bushy tail with white tip',
          'Pointed ears and muzzle',
          'Adult size similar to medium dog',
          'Distinctive tracks and scats'
        ],
        seasonalBehavior: 'Most active at dawn and dusk, with increased activity during breeding season. More visible during winter months.',
        habitat: 'Adaptable to various environments including urban areas, agricultural lands, forests, and coastal regions.',
        reproduction: 'Breed once per year, producing 4-6 pups. Young disperse in autumn to find new territories.',
        distribution: 'Widespread across southern and eastern Australia, particularly in New South Wales, Victoria, and South Australia.',
        legalStatus: 'Declared pest animal in most Australian states. Control programs are actively managed.',
        reporting: 'Report sightings and damage to local authorities or wildlife agencies.'
      },
      'cane-toad': {
        name: 'Cane Toad',
        scientificName: 'Rhinella marina',
        type: 'Amphibian',
        nativeRange: 'Central and South America',
        firstDetected: '1935',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Cane Toads are highly toxic amphibians that pose a serious threat to native wildlife. They compete with native species for food and habitat, and their toxins can kill predators that attempt to eat them.',
        controlMethods: [
          'Physical removal: Hand collection and euthanasia',
          'Barrier installation: Fencing to prevent movement',
          'Habitat modification: Remove water sources and shelter',
          'Biological control: Research into natural predators',
          'Community trapping programs: Organized removal efforts'
        ],
        economicImpact: 'Cane Toads cause significant economic losses through impacts on tourism, agriculture, and native wildlife populations. They also increase management and control costs.',
        ecologicalImpact: 'Prey on native insects and small animals, compete with native amphibians, and poison native predators. They can significantly reduce populations of native species.',
        managementStrategies: [
          'Prevention of further spread',
          'Community education and awareness',
          'Research into control methods',
          'Habitat restoration programs',
          'Monitoring and assessment programs'
        ],
        preventionTips: [
          'Prevent accidental transport in vehicles',
          'Clean equipment and materials',
          'Report new populations immediately',
          'Support community control programs',
          'Learn to identify Cane Toads correctly'
        ],
        identification: [
          'Large, warty brown toad',
          'Distinctive parotoid glands behind eyes',
          'Creamy underside with dark spots',
          'Adult size 10-15cm',
          'Distinctive call: loud, continuous croaking'
        ],
        seasonalBehavior: 'Most active during wet seasons and at night. Breed in standing water during summer months.',
        habitat: 'Prefers moist environments near water sources. Common in gardens, agricultural areas, and urban environments.',
        reproduction: 'Lay thousands of eggs in water. Tadpoles develop quickly and can survive in various water conditions.',
        distribution: 'Widespread across northern Australia, particularly in Queensland and Northern Territory.',
        legalStatus: 'Declared pest animal in most Australian states. Control programs are actively managed.',
        reporting: 'Report sightings to local authorities or use citizen science apps. Include location and photos.'
      },
      'feral-pig': {
        name: 'Feral Pig',
        scientificName: 'Sus scrofa',
        type: 'Mammal',
        nativeRange: 'Europe and Asia',
        firstDetected: '1788',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Feral Pigs are highly destructive omnivores that cause extensive damage to native vegetation, agricultural crops, and watercourses. They can rapidly increase in numbers and dominate landscapes.',
        controlMethods: [
          'Trapping programs: Use large traps and baiting',
          'Aerial shooting: Professional control programs',
          'Exclusion fencing: Protect sensitive areas',
          'Habitat modification: Remove food sources and shelter',
          'Community-based control initiatives'
        ],
        economicImpact: 'Significant costs in agricultural damage, land degradation, and control programs. Can make land unsuitable for farming and significantly impact water quality.',
        ecologicalImpact: 'Root up native vegetation, cause soil erosion, compete with native species, spread diseases, and can significantly alter ecosystem structure and function.',
        managementStrategies: [
          'Integrated pest management programs',
          'Community education and awareness',
          'Habitat protection and restoration',
          'Regular monitoring and assessment',
          'Collaboration with neighboring landowners'
        ],
        preventionTips: [
          'Prevent accidental transport of pigs',
          'Secure livestock and crops',
          'Report large populations to authorities',
          'Support native wildlife conservation',
          'Learn to identify pig signs and damage'
        ],
        identification: [
          'Variable coat color from black to brown',
          'Large, muscular body with long snout',
          'Tusks in adults (especially males)',
          'Adult size 100-200kg',
          'Distinctive tracks and rooting damage'
        ],
        seasonalBehavior: 'Most active at dawn and dusk, with increased activity during cooler months. More visible during feeding times.',
        habitat: 'Adaptable to various environments including forests, wetlands, agricultural lands, and coastal areas.',
        reproduction: 'Highly reproductive, can produce multiple litters per year with 6-10 young per litter.',
        distribution: 'Widespread across northern and eastern Australia, particularly in Queensland and New South Wales.',
        legalStatus: 'Declared pest animal in most Australian states. Control programs are actively managed.',
        reporting: 'Report large populations and damage to local authorities or agricultural agencies.'
      },
      'mouse-ear-hawkweed': {
        name: 'Mouse Ear Hawkweed',
        scientificName: 'Hieracium pilosella',
        type: 'Perennial Herb',
        nativeRange: 'Europe',
        firstDetected: '1860s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Mouse Ear Hawkweed forms dense mats that exclude native plants and can dominate pasture areas. It spreads rapidly through runners and seeds.',
        controlMethods: [
          'Herbicide application during active growth',
          'Mechanical removal of small infestations',
          'Prevent seed production by cutting flowers',
          'Improve soil fertility to favor native species',
          'Regular monitoring and early intervention'
        ],
        economicImpact: 'Reduces pasture productivity and can make land unsuitable for grazing. Increases management costs for agricultural operations.',
        ecologicalImpact: 'Forms dense mats that exclude native vegetation, reduces biodiversity, and alters soil conditions.',
        managementStrategies: [
          'Integrated weed management programs',
          'Pasture improvement initiatives',
          'Early detection and rapid response',
          'Community education programs',
          'Regular monitoring and assessment'
        ],
        preventionTips: [
          'Clean vehicles and equipment between sites',
          'Prevent seed spread in hay and feed',
          'Maintain healthy pastures',
          'Report new infestations immediately',
          'Use certified weed-free materials'
        ],
        identification: [
          'Small rosettes of hairy leaves',
          'Yellow daisy-like flowers on tall stems',
          'White milky sap when broken',
          'Spreads by runners forming dense mats',
          'Prefers open, disturbed areas'
        ],
        seasonalBehavior: 'Flowers in spring and summer. Most active growth occurs in spring and autumn.',
        habitat: 'Pastures, roadsides, disturbed areas, and open grasslands. Prefers well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative runners. Seeds can remain viable for several years.',
        distribution: 'Found in NSW, VIC, and TAS, particularly in cooler regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is required for landowners.',
        reporting: 'Report new infestations to local agricultural authorities or biosecurity agencies.'
      },
      'mikania': {
        name: 'Mikania',
        scientificName: 'Mikania micrantha',
        type: 'Climbing Vine',
        nativeRange: 'Tropical America',
        firstDetected: '1900s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Mikania is a fast-growing vine that smothers native vegetation and can block waterways. It forms dense mats that exclude other plants.',
        controlMethods: [
          'Cut and treat vines immediately with herbicide',
          'Remove from trees and structures before treatment',
          'Prevent vine growth by regular cutting',
          'Monitor for regrowth from roots',
          'Biological control using specific insects'
        ],
        economicImpact: 'Significant costs in vegetation management and waterway maintenance. Can block irrigation systems and reduce agricultural productivity.',
        ecologicalImpact: 'Smothers native vegetation, reduces biodiversity, blocks waterways, and can alter ecosystem functions.',
        managementStrategies: [
          'Integrated vine management programs',
          'Waterway protection initiatives',
          'Early detection and rapid response',
          'Community awareness campaigns',
          'Regular monitoring and control'
        ],
        preventionTips: [
          'Prevent vine establishment in gardens',
          'Clean equipment and vehicles',
          'Avoid planting Mikania',
          'Report new infestations immediately',
          'Support native vegetation restoration'
        ],
        identification: [
          'Fast-growing climbing vine',
          'Heart-shaped leaves with pointed tips',
          'Small white flowers in clusters',
          'Forms dense mats over vegetation',
          'Prefers moist, disturbed areas'
        ],
        seasonalBehavior: 'Most active growth in wet seasons. Can grow year-round in tropical climates.',
        habitat: 'Forests, waterways, disturbed areas, and gardens. Prefers moist conditions.',
        reproduction: 'Reproduces by seed and vegetative fragments. Seeds are dispersed by wind and water.',
        distribution: 'Found in QLD, NSW, and NT, particularly in tropical and subtropical regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local biosecurity authorities or agricultural agencies.'
      },
      'spiked-pepper': {
        name: 'Spiked Pepper',
        scientificName: 'Piper aduncum',
        type: 'Shrub/Tree',
        nativeRange: 'Tropical America',
        firstDetected: '1850s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Spiked Pepper forms dense thickets with allelopathic effects that inhibit other plant growth. It can dominate disturbed areas and prevent native regeneration.',
        controlMethods: [
          'Cut larger plants and treat stumps immediately',
          'Remove by hand for small plants ensuring roots are removed',
          'Prevent seed spread by removing before fruiting',
          'Apply herbicide to actively growing plants',
          'Monitor for regrowth and treat promptly'
        ],
        economicImpact: 'Reduces land productivity and increases management costs. Can prevent agricultural development and reduce property values.',
        ecologicalImpact: 'Forms dense thickets that exclude native species, has allelopathic effects that inhibit other plant growth, and prevents natural regeneration.',
        managementStrategies: [
          'Integrated weed management programs',
          'Habitat restoration initiatives',
          'Early detection and rapid response',
          'Community education programs',
          'Regular monitoring and control'
        ],
        preventionTips: [
          'Prevent seed spread in soil and equipment',
          'Avoid planting Spiked Pepper',
          'Maintain healthy native vegetation',
          'Report new infestations immediately',
          'Support habitat restoration programs'
        ],
        identification: [
          'Large shrub or small tree up to 6m tall',
          'Alternate, heart-shaped leaves',
          'Spikes of small white flowers',
          'Produces small black berries',
          'Distinctive peppery smell when crushed'
        ],
        seasonalBehavior: 'Flowers and fruits year-round in tropical climates. Most active growth during wet seasons.',
        habitat: 'Forests, disturbed areas, and gardens. Prefers moist, well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by birds and animals.',
        distribution: 'Found in NSW, QLD, and VIC, particularly in tropical and subtropical regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is required for landowners.',
        reporting: 'Report new infestations to local biosecurity authorities or agricultural agencies.'
      },
      'black-sage': {
        name: 'Black Sage',
        scientificName: 'Cordia curassavica',
        type: 'Shrub',
        nativeRange: 'Tropical America',
        firstDetected: '1800s',
        impact: 'Medium',
        spread: 'Medium',
        risk: 'Medium',
        description: 'Black Sage forms dense stands that reduce biodiversity and can dominate disturbed areas. It spreads readily in coastal and near-coastal regions.',
        controlMethods: [
          'Apply herbicide when plants are actively growing',
          'Monitor for seedlings after initial treatment',
          'Consider mulching to suppress regrowth',
          'Mechanical removal for small infestations',
          'Regular follow-up treatments'
        ],
        economicImpact: 'Moderate costs in vegetation management and can reduce land productivity in affected areas.',
        ecologicalImpact: 'Forms dense stands that reduce biodiversity and can alter ecosystem structure in coastal areas.',
        managementStrategies: [
          'Integrated weed management programs',
          'Coastal vegetation protection',
          'Early detection and intervention',
          'Community awareness programs',
          'Regular monitoring and assessment'
        ],
        preventionTips: [
          'Prevent seed spread in coastal areas',
          'Avoid planting Black Sage',
          'Maintain healthy native coastal vegetation',
          'Report new infestations immediately',
          'Support coastal restoration programs'
        ],
        identification: [
          'Dense shrub up to 3m tall',
          'Oval leaves with smooth edges',
          'Small white flowers in clusters',
          'Black berries when ripe',
          'Prefers coastal and near-coastal areas'
        ],
        seasonalBehavior: 'Flowers and fruits year-round in tropical climates. Most active growth during warm, wet periods.',
        habitat: 'Coastal areas, disturbed sites, and gardens. Prefers well-drained soils and full sun.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by birds and water.',
        distribution: 'Found in NSW, VIC, and QLD, particularly in coastal regions.',
        legalStatus: 'Declared noxious weed in affected states. Control may be required in some areas.',
        reporting: 'Report new infestations to local coastal authorities or biosecurity agencies.'
      },
      'cane-tibouchina': {
        name: 'Cane Tibouchina',
        scientificName: 'Tibouchina urvilleana',
        type: 'Shrub',
        nativeRange: 'Brazil',
        firstDetected: '1950s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Cane Tibouchina forms dense thickets that displace native vegetation and can dominate disturbed areas. It spreads rapidly and is difficult to control.',
        controlMethods: [
          'Cut stems close to ground and treat immediately',
          'Remove all plant material to prevent spread',
          'Monitor for root suckers and treat promptly',
          'Apply herbicide to actively growing plants',
          'Regular follow-up treatments required'
        ],
        economicImpact: 'Significant costs in vegetation management and can reduce land productivity. Difficult and expensive to control once established.',
        ecologicalImpact: 'Forms dense thickets that displace native species and can alter ecosystem structure and function.',
        managementStrategies: [
          'Integrated weed management programs',
          'Early detection and rapid response',
          'Habitat restoration initiatives',
          'Community education programs',
          'Regular monitoring and control'
        ],
        preventionTips: [
          'Prevent seed spread in soil and equipment',
          'Avoid planting Cane Tibouchina',
          'Maintain healthy native vegetation',
          'Report new infestations immediately',
          'Support habitat restoration programs'
        ],
        identification: [
          'Large shrub up to 4m tall',
          'Large, hairy leaves with prominent veins',
          'Bright purple flowers',
          'Square stems with rough texture',
          'Forms dense, spreading thickets'
        ],
        seasonalBehavior: 'Flowers primarily in autumn and winter. Most active growth during warm, wet periods.',
        habitat: 'Forests, disturbed areas, and gardens. Prefers moist, well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind, water, and animals.',
        distribution: 'Found in NSW and QLD, particularly in subtropical regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local biosecurity authorities or agricultural agencies.'
      },
      'leafy-spurge': {
        name: 'Leafy Spurge',
        scientificName: 'Euphorbia esula',
        type: 'Perennial Herb',
        nativeRange: 'Europe and Asia',
        firstDetected: '1900s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Leafy Spurge is toxic to livestock and forms dense stands that exclude other vegetation. It spreads rapidly through seeds and root fragments.',
        controlMethods: [
          'Wear gloves - milky sap causes skin irritation',
          'Apply herbicide to actively growing plants',
          'May require multiple treatments over several years',
          'Prevent seed production by cutting flowers',
          'Monitor for regrowth from deep roots'
        ],
        economicImpact: 'Significant costs in livestock management and pasture productivity. Can make land unsuitable for grazing.',
        ecologicalImpact: 'Forms dense stands that exclude native vegetation and can be toxic to wildlife and livestock.',
        managementStrategies: [
          'Integrated weed management programs',
          'Livestock protection initiatives',
          'Early detection and rapid response',
          'Community education programs',
          'Regular monitoring and assessment'
        ],
        preventionTips: [
          'Prevent seed spread in hay and feed',
          'Clean vehicles and equipment thoroughly',
          'Avoid areas with known infestations',
          'Report new infestations immediately',
          'Support native pasture improvement'
        ],
        identification: [
          'Perennial herb up to 1m tall',
          'Narrow, lance-shaped leaves',
          'Small yellow-green flowers',
          'White milky sap when broken',
          'Forms dense, spreading colonies'
        ],
        seasonalBehavior: 'Flowers in spring and summer. Most active growth occurs in spring and autumn.',
        habitat: 'Pastures, roadsides, and disturbed areas. Prefers well-drained soils.',
        reproduction: 'Reproduces by seed and root fragments. Seeds can remain viable for many years.',
        distribution: 'Found in NSW, VIC, and SA, particularly in temperate regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local agricultural authorities or biosecurity agencies.'
      },
      'asiatic-sand-sedge': {
        name: 'Asiatic Sand Sedge',
        scientificName: 'Carex kobomugi',
        type: 'Perennial Grass',
        nativeRange: 'Asia',
        firstDetected: '1980s',
        impact: 'Medium',
        spread: 'Medium',
        risk: 'Medium',
        description: 'Asiatic Sand Sedge stabilizes dunes and can change coastal ecosystems by altering natural dune dynamics and excluding native species.',
        controlMethods: [
          'Most effective control during active growth period',
          'Apply herbicide when soil is moist',
          'Monitor for regrowth and treat promptly',
          'Physical removal for small infestations',
          'Prevent seed spread in coastal areas'
        ],
        economicImpact: 'Moderate costs in coastal management and can affect tourism and coastal property values.',
        ecologicalImpact: 'Stabilizes dunes and changes coastal ecosystem dynamics, potentially excluding native dune species.',
        managementStrategies: [
          'Coastal weed management programs',
          'Dune protection initiatives',
          'Early detection and intervention',
          'Community awareness programs',
          'Regular monitoring and assessment'
        ],
        preventionTips: [
          'Prevent seed spread in coastal areas',
          'Avoid planting Asiatic Sand Sedge',
          'Maintain healthy native dune vegetation',
          'Report new infestations immediately',
          'Support coastal restoration programs'
        ],
        identification: [
          'Perennial grass forming dense mats',
          'Long, narrow leaves',
          'Brown flower spikes',
          'Extensive root system',
          'Prefers coastal dune environments'
        ],
        seasonalBehavior: 'Most active growth in spring and summer. Can tolerate harsh coastal conditions.',
        habitat: 'Coastal dunes and sandy areas. Prefers well-drained, sandy soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind and water.',
        distribution: 'Found in NSW, VIC, and SA, particularly in coastal regions.',
        legalStatus: 'Declared noxious weed in affected states. Control may be required in coastal areas.',
        reporting: 'Report new infestations to local coastal authorities or biosecurity agencies.'
      },
      'halogeton': {
        name: 'Halogeton',
        scientificName: 'Halogeton glomeratus',
        type: 'Annual Herb',
        nativeRange: 'Central Asia',
        firstDetected: '1960s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Halogeton is toxic to livestock and forms dense stands that can dominate rangeland areas. It\'s particularly dangerous to sheep and cattle.',
        controlMethods: [
          'Remove plants before seed production',
          'Apply herbicide to actively growing plants',
          'Be cautious - toxic to livestock',
          'Prevent seed spread in feed and equipment',
          'Monitor for regrowth and treat promptly'
        ],
        economicImpact: 'Significant costs in livestock management and can cause livestock deaths. Reduces grazing productivity.',
        ecologicalImpact: 'Forms dense stands that exclude native vegetation and can be toxic to wildlife and livestock.',
        managementStrategies: [
          'Integrated weed management programs',
          'Livestock protection initiatives',
          'Early detection and rapid response',
          'Community education programs',
          'Regular monitoring and assessment'
        ],
        preventionTips: [
          'Prevent seed spread in feed and equipment',
          'Avoid grazing areas with known infestations',
          'Clean vehicles and equipment thoroughly',
          'Report new infestations immediately',
          'Support native rangeland improvement'
        ],
        identification: [
          'Annual herb up to 60cm tall',
          'Small, fleshy leaves',
          'Red stems and leaf tips',
          'Small green flowers in clusters',
          'Forms dense, spreading colonies'
        ],
        seasonalBehavior: 'Annual plant that germinates in spring and flowers in summer. Dies back in winter.',
        habitat: 'Rangelands, roadsides, and disturbed areas. Prefers alkaline soils.',
        reproduction: 'Reproduces by seed only. Seeds can remain viable for several years.',
        distribution: 'Found in NSW, VIC, SA, and WA, particularly in arid and semi-arid regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local agricultural authorities or biosecurity agencies.'
      },
      'wiregrass': {
        name: 'Wiregrass',
        scientificName: 'Sporobolus indicus',
        type: 'Perennial Grass',
        nativeRange: 'Tropical America',
        firstDetected: '1800s',
        impact: 'Medium',
        spread: 'Medium',
        risk: 'Medium',
        description: 'Wiregrass forms dense stands that can be a fire hazard and competes with native grasses. It\'s particularly problematic in pasture areas.',
        controlMethods: [
          'Control is most effective when soil is moist',
          'Apply herbicide to actively growing plants',
          'Monitor for regrowth and treat as needed',
          'Prevent seed spread in hay and feed',
          'Improve soil fertility to favor native species'
        ],
        economicImpact: 'Moderate costs in pasture management and can reduce grazing productivity.',
        ecologicalImpact: 'Forms dense stands that compete with native grasses and can alter fire regimes.',
        managementStrategies: [
          'Integrated weed management programs',
          'Pasture improvement initiatives',
          'Early detection and intervention',
          'Community education programs',
          'Regular monitoring and assessment'
        ],
        preventionTips: [
          'Prevent seed spread in hay and feed',
          'Clean vehicles and equipment between sites',
          'Maintain healthy pastures',
          'Report new infestations immediately',
          'Support native pasture improvement'
        ],
        identification: [
          'Perennial grass up to 1m tall',
          'Narrow, wiry leaves',
          'Open, spreading growth habit',
          'Small seed heads',
          'Forms dense, spreading colonies'
        ],
        seasonalBehavior: 'Most active growth in warm, wet periods. Can remain green year-round in suitable climates.',
        habitat: 'Pastures, roadsides, and disturbed areas. Prefers well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind, water, and animals.',
        distribution: 'Found in NSW, VIC, QLD, and SA, particularly in temperate and subtropical regions.',
        legalStatus: 'Declared noxious weed in affected states. Control may be required in some areas.',
        reporting: 'Report new infestations to local agricultural authorities or biosecurity agencies.'
      },
      'portuguese-broom': {
        name: 'Portuguese Broom',
        scientificName: 'Cytisus striatus',
        type: 'Shrub',
        nativeRange: 'Portugal and Spain',
        firstDetected: '1800s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Portuguese Broom forms dense stands and is a nitrogen-fixing plant that can alter soil chemistry. It spreads rapidly and is difficult to control.',
        controlMethods: [
          'Cut and treat stumps immediately with herbicide',
          'Remove all seed pods to prevent spread',
          'Monitor for 3-5 years due to long seed viability',
          'Apply herbicide to actively growing plants',
          'Regular follow-up treatments required'
        ],
        economicImpact: 'Significant costs in vegetation management and can reduce land productivity. Difficult to control once established.',
        ecologicalImpact: 'Forms dense stands that exclude native species and can alter soil chemistry through nitrogen fixation.',
        managementStrategies: [
          'Integrated weed management programs',
          'Early detection and rapid response',
          'Habitat restoration initiatives',
          'Community education programs',
          'Regular monitoring and control'
        ],
        preventionTips: [
          'Prevent seed spread in soil and equipment',
          'Avoid planting Portuguese Broom',
          'Maintain healthy native vegetation',
          'Report new infestations immediately',
          'Support habitat restoration programs'
        ],
        identification: [
          'Large shrub up to 3m tall',
          'Small, three-parted leaves',
          'Bright yellow pea-like flowers',
          'Long, narrow seed pods',
          'Forms dense, spreading thickets'
        ],
        seasonalBehavior: 'Flowers in spring and early summer. Seeds can remain viable for many years.',
        habitat: 'Forests, disturbed areas, and gardens. Prefers well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind, water, and animals.',
        distribution: 'Found in NSW, VIC, SA, and TAS, particularly in temperate regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local biosecurity authorities or agricultural agencies.'
      },
      'black-swallow-wort': {
        name: 'Black Swallow-wort',
        scientificName: 'Cynanchum louiseae',
        type: 'Perennial Vine',
        nativeRange: 'Europe',
        firstDetected: '1900s',
        impact: 'High',
        spread: 'High',
        risk: 'High',
        description: 'Black Swallow-wort forms dense stands and is toxic to monarch butterflies. It can dominate disturbed areas and prevent native regeneration.',
        controlMethods: [
          'Cut stems and treat with herbicide immediately',
          'Remove all plant material including roots',
          'Monitor for regrowth from remaining roots',
          'Apply herbicide to actively growing plants',
          'Regular follow-up treatments required'
        ],
        economicImpact: 'Significant costs in vegetation management and can affect biodiversity conservation efforts.',
        ecologicalImpact: 'Forms dense stands that exclude native species and can be toxic to monarch butterflies and other wildlife.',
        managementStrategies: [
          'Integrated weed management programs',
          'Biodiversity conservation initiatives',
          'Early detection and rapid response',
          'Community education programs',
          'Regular monitoring and control'
        ],
        preventionTips: [
          'Prevent seed spread in soil and equipment',
          'Avoid planting Black Swallow-wort',
          'Maintain healthy native vegetation',
          'Report new infestations immediately',
          'Support biodiversity conservation programs'
        ],
        identification: [
          'Perennial vine up to 2m tall',
          'Opposite, heart-shaped leaves',
          'Small, dark purple flowers',
          'Long, narrow seed pods',
          'Forms dense, spreading colonies'
        ],
        seasonalBehavior: 'Flowers in summer. Most active growth occurs during warm, wet periods.',
        habitat: 'Forests, disturbed areas, and gardens. Prefers well-drained soils.',
        reproduction: 'Reproduces by seed and vegetative means. Seeds are dispersed by wind and water.',
        distribution: 'Found in NSW, VIC, and SA, particularly in temperate regions.',
        legalStatus: 'Declared noxious weed in affected states. Control is mandatory for landowners.',
        reporting: 'Report new infestations to local biosecurity authorities or agricultural agencies.'
      }
    };

    return speciesData[name.toLowerCase()] || speciesData['lantana']; // Default fallback
  };

  useEffect(() => {
    if (speciesName) {
      const loadSpeciesData = async () => {
        try {
          // Try to load from CSV first
          const csvData = await getSpeciesByName(speciesName);
          if (csvData) {
            setCsvSpeciesData(csvData);
            // Convert CSV data to the format expected by the component
            const speciesDetail: SpeciesDetail = {
              name: csvData.name,
              scientificName: csvData.scientificName,
              type: csvData.type,
              nativeRange: csvData.nativeRange,
              firstDetected: csvData.firstDetected,
              impact: csvData.threatLevel === 'high' ? 'High' : csvData.threatLevel === 'medium' ? 'Medium' : 'Low',
              spread: csvData.threatLevel === 'high' ? 'High' : csvData.threatLevel === 'medium' ? 'Medium' : 'Low',
              risk: csvData.threatLevel === 'high' ? 'High' : csvData.threatLevel === 'medium' ? 'Medium' : 'Low',
              description: csvData.description,
              controlMethods: [
                'Apply herbicide when plants are actively growing',
                'Monitor for regrowth and treat promptly',
                'Prevent seed spread in soil and equipment',
                'Report new infestations immediately',
                'Support habitat restoration programs'
              ],
              economicImpact: 'Costs vary based on infestation size and control methods required.',
              ecologicalImpact: csvData.description,
              managementStrategies: [
                'Integrated weed management programs',
                'Early detection and rapid response',
                'Community education programs',
                'Regular monitoring and assessment',
                'Habitat restoration initiatives'
              ],
              preventionTips: [
                'Prevent seed spread in soil and equipment',
                'Avoid planting this species',
                'Maintain healthy native vegetation',
                'Report new infestations immediately',
                'Support habitat restoration programs'
              ],
              identification: [
                'Check field guides for specific identification features',
                'Consult with local experts for confirmation',
                'Take clear photos of key features',
                'Note location and habitat details',
                'Compare with known invasive species'
              ],
              seasonalBehavior: 'Most active growth during warm, wet periods. Varies by species and location.',
              habitat: 'Disturbed areas, roadsides, and various habitats. Preferences vary by species.',
              reproduction: 'Reproduces by seed and vegetative means. Seeds dispersed by various methods.',
              distribution: csvData.quickFacts.distribution,
              legalStatus: 'Declared noxious weed in affected states. Control may be required.',
              reporting: 'Report new infestations to local biosecurity authorities or agricultural agencies.'
            };
            setSpecies(speciesDetail);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error loading CSV species data:', error);
        }
        
        // Fallback to hardcoded data
        const speciesData = getSpeciesData(speciesName);
        setSpecies(speciesData);
        setIsLoading(false);
      };
      
      loadSpeciesData();
    }
  }, [speciesName]);

  if (!species) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Different tabs for native vs invasive species
  const tabs = species.impact === 'Beneficial' ? [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'control', label: 'Conservation Tips', icon: Wrench },
    { id: 'impact', label: 'Benefits', icon: TrendingUp },
    { id: 'identification', label: 'Identification', icon: Search },
    { id: 'prevention', label: 'Protection', icon: Shield }
  ] : [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'control', label: 'Prevention Tips', icon: Wrench },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'identification', label: 'Identification', icon: Search },
    { id: 'prevention', label: 'Prevention', icon: Shield }
  ];

  return (
    <div className="min-h-screen">
      {/* SimpleHeader - same as homepage */}
      <SimpleHeader />

      {/* Page Content */}
      <div>
        {/* Enhanced Back Button Header */}
        <div className="relative bg-gradient-to-r from-green-800 via-green-700 to-green-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-300/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  <span className="inline-block">
                    {species.name}
                  </span>
                </h1>
                <p className="text-green-100 text-sm sm:text-base italic">
                  {species.scientificName}
                </p>
              </div>
            </div>
          </div>
        </div>

      <div ref={parallaxRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          // Skeleton Loading State
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-48 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Species Header Card */
          <div className="relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 sm:p-8 mb-6 sm:mb-8 overflow-hidden">
            {/* Floating particles around the card */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float parallax-element"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{species.name}</h2>
                <p className="text-lg text-gray-600 italic">{species.scientificName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Type: <span className="font-medium">{species.type}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Native: <span className="font-medium">{species.nativeRange}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">First Detected: <span className="font-medium">{species.firstDetected}</span></span>
                </div>
                
                {/* CTA for Interactive Map */}
                <div className="mt-4">
                  <Link 
                    to="/map?openInteractive=true"
                    onClick={scrollToTop}
                    className="group inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
                  >
                    <MapPin className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:tracking-wide transition-all duration-300">
                      {species.impact === 'Beneficial' ? 'See Distribution' : 'See the Spread'}
                    </span>
                    <span className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Middle Column - Enhanced Assessment (Different for Native vs Invasive) */}
            <div className="space-y-3 sm:space-y-4">
              {species.impact === 'Beneficial' ? (
                // Native Species - Positive Benefits
                <>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    <span>How Much of a Benefit?</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div 
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredElement('impact')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <span className="text-sm text-gray-600 font-medium">Ecological value:</span>
                      <span className="px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300 transform group-hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30">
                        {species.impact}
                      </span>
                    </div>
                    <div 
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredElement('spread')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <span className="text-sm text-gray-600 font-medium">Natural distribution:</span>
                      <span className="px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300 transform group-hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30">
                        {species.spread}
                      </span>
                    </div>
                    <div 
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredElement('risk')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <span className="text-sm text-gray-600 font-medium">Conservation priority:</span>
                      <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform group-hover:scale-105">
                        {species.risk}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // Invasive Species - Problem Assessment
                <>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span>How Much of a Problem?</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div 
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredElement('impact')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <span className="text-sm text-gray-600 font-medium">How much damage does it cause:</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
                        species.impact === 'High' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30' 
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30'
                      }`}>
                        {species.impact}
                      </span>
                    </div>
                    <div 
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredElement('spread')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <span className="text-sm text-gray-600 font-medium">How fast does it spread:</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
                        species.spread === 'High' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30' 
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30'
                      }`}>
                        {species.spread}
                      </span>
                    </div>
                    <div 
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredElement('risk')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <span className="text-sm text-gray-600 font-medium">Overall threat level:</span>
                      <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform group-hover:scale-105">
                        {species.risk}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Enhanced Image Column */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span>Species Image</span>
              </h3>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-500"></div>
                <img 
                  src={getSpeciesImage(species.name)}
                  alt={species.name}
                  className="relative w-full h-48 sm:h-64 lg:h-72 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                  onError={(e) => {
                    // If the image fails to load, use the SVG fallback
                    const svgFallback = `data:image/svg+xml;base64,${btoa(`
                      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                        <rect width="300" height="200" fill="#4F46E5"/>
                        <text x="150" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Image Error</text>
                        <text x="150" y="125" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Failed to Load</text>
                      </svg>
                    `)}`;
                    e.currentTarget.src = svgFallback;
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            </div>
          </div>
        )}

        {/* Enhanced Tab Navigation */}
        <div className="relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 mb-6 overflow-hidden">
          {/* Floating particles around tabs */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={`tab-particle-${i}`}
                className="absolute w-1 h-1 bg-green-400/20 rounded-full animate-float parallax-element"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative z-10 border-b border-gray-200/50">
            <nav className="flex overflow-x-auto no-scrollbar space-x-2 sm:space-x-4 px-3 sm:px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-2 whitespace-nowrap transition-all duration-300 rounded-t-xl ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600 bg-gradient-to-b from-green-50 to-green-100 shadow-lg shadow-green-500/20'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                      activeTab === tab.id ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span className="transition-all duration-300">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Description
                  </h3>
                  <p className="text-gray-800 leading-relaxed font-medium bg-white p-4 rounded-lg shadow-sm border border-blue-100">{species.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      Habitat
                    </h4>
                    <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-green-100">{species.habitat}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                      Seasonal Behavior
                    </h4>
                    <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-orange-100">{species.seasonalBehavior}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                      <Leaf className="w-4 h-4 mr-2 text-purple-600" />
                      Reproduction
                    </h4>
                    <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-purple-100">{species.reproduction}</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h4 className="text-lg font-bold text-teal-800 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-teal-600" />
                      Distribution
                    </h4>
                    <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-teal-100">{species.distribution}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'control' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-green-600" />
                      Prevention Tips
                    </h3>
                    <div className="space-y-4">
                      {species.controlMethods.map((method, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                            {index + 1}
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">{method}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                    <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Management Strategies
                    </h3>
                    <div className="space-y-3">
                      {species.managementStrategies.map((strategy, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200">
                          <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <p className="text-gray-800 font-medium leading-relaxed">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-100 shadow-sm">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                    Economic Impact
                  </h3>
                  <p className="text-gray-800 leading-relaxed font-medium bg-white p-4 rounded-lg shadow-sm border border-red-100">{species.economicImpact}</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                    Ecological Impact
                  </h3>
                  <p className="text-gray-800 leading-relaxed font-medium bg-white p-4 rounded-lg shadow-sm border border-orange-100">{species.ecologicalImpact}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-purple-600" />
                    Legal Status
                  </h4>
                  <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-purple-100">{species.legalStatus}</p>
                </div>
              </div>
            )}

            {activeTab === 'identification' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-blue-600" />
                    Key Identification Features
                  </h3>
                  <div className="space-y-3">
                    {species.identification.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                          ✓
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-green-600" />
                    Reporting
                  </h4>
                  <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-green-100">{species.reporting}</p>
                </div>
              </div>
            )}

            {activeTab === 'prevention' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-yellow-600" />
                    Prevention Tips
                  </h3>
                  <div className="space-y-3">
                    {species.preventionTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-yellow-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                          !
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed">{tip}</p>
                      </div>
                    ))}
            </div>
          </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-blue-600" />
                    Remember
                  </h4>
                  <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                    Early detection and rapid response are crucial for effective invasive species management. 
                    If you suspect you've found this species, report it immediately to your local authorities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Check out more species section */}
      <div className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-12 sm:py-16 overflow-hidden">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-parallax-up parallax-element"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/15 rounded-full blur-3xl animate-parallax-down parallax-element"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Explore More Invasive Species
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover other invasive species that might be affecting your area and learn how to identify and manage them.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/education" 
              onClick={scrollToTop}
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-105 border-2 border-green-500/20 hover:border-green-400/40"
            >
              <span className="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">🔍</span>
              <span className="group-hover:tracking-wide transition-all duration-300">Browse All Species</span>
              <span className="ml-3 text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
            
            <Link
              to="/map"
              onClick={scrollToTop}
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 border-2 border-blue-500/20 hover:border-blue-400/40"
            >
              <span className="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">🗺️</span>
              <span className="group-hover:tracking-wide transition-all duration-300">View on Map</span>
              <span className="ml-3 text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default SpeciesDetailPage;
