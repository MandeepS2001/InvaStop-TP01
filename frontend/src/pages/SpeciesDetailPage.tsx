import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield, Target, MapPin, Calendar, Leaf, Zap } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user came from map or species profile page
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from');

  // Get species image - same function as in InteractiveMap
  const getSpeciesImage = (speciesName: string) => {
    // Use images from the top10 folder in public - updated to match actual file names
    const imageMap: Record<string, string> = {
      'Lantana': '/top10/Lantana.png',
      'Bitou Bush': '/top10/BitouBush.png',
      'Common Myna': '/top10/CommonMyna.png',
      'Gorse': '/top10/Gorse.png',
      'Buffel Grass': '/top10/BuffelGrass.png',
      'Cane Toad': '/top10/CaneToad.png',
      'Red Fox': '/top10/RedFox.png',
      'Gamba Grass': '/top10/GambaGrass.png',
      'European Rabbit': '/top10/EuropeanRabbit.jpg',
      'Feral Pig': '/top10/FeralPig.png'
    };
    
    // Return the mapped image or create a simple SVG fallback
    if (imageMap[speciesName]) {
      console.log(`Loading image for ${speciesName}: ${imageMap[speciesName]}`);
      return imageMap[speciesName];
    }
    
    console.log(`No image found for ${speciesName}, using fallback`);
    // Create a simple SVG fallback for missing images
    const svgFallback = `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#4F46E5"/>
        <text x="150" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Species Image</text>
        <text x="150" y="125" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Not Available</text>
      </svg>
    `)}`;
    
    return svgFallback;
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
      }
    };

    return speciesData[name.toLowerCase()] || speciesData['lantana']; // Default fallback
  };

  useEffect(() => {
    if (speciesName) {
      const speciesData = getSpeciesData(speciesName);
      setSpecies(speciesData);
    }
  }, [speciesName]);

  if (!species) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Leaf },
    { id: 'control', label: 'Control Methods', icon: Target },
    { id: 'impact', label: 'Impact', icon: AlertTriangle },
    { id: 'identification', label: 'Identification', icon: Shield },
    { id: 'prevention', label: 'Prevention', icon: Zap }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-green-200 transition-colors">
                Home
              </Link>
              <Link to="/map" className="text-white hover:text-green-200 transition-colors">
                Map
              </Link>
              <Link to="/education" className="text-white hover:text-green-200 transition-colors">
                Species Profile
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white hover:text-green-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-green-700 border-t border-green-600">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/map" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Map
              </Link>
              <Link 
                to="/education" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Species Profile
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <div className="pt-24">
        {/* Back Button Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <Link
                to={fromPage === 'map' ? '/map' : '/education'}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{fromPage === 'map' ? 'Back to Map' : 'Check out more species'}</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{species.name}</h1>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Species Header Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
            </div>

            {/* Middle Column - Risk Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Impact Level:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    species.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {species.impact}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Spread Likelihood:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    species.spread === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {species.spread}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Risk:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {species.risk.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Species Image</h3>
                <div className="relative">
                <img 
                  src={getSpeciesImage(species.name)}
                  alt={species.name}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
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
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{species.description}</p>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Habitat</h4>
                    <p className="text-gray-700">{species.habitat}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Seasonal Behavior</h4>
                    <p className="text-gray-700">{species.seasonalBehavior}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Reproduction</h4>
                    <p className="text-gray-700">{species.reproduction}</p>
                    </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Distribution</h4>
                    <p className="text-gray-700">{species.distribution}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'control' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Control Methods</h3>
                  <div className="space-y-4">
                    {species.controlMethods.map((method, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{method}</p>
                      </div>
                    ))}
            </div>
          </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Management Strategies</h4>
                  <div className="space-y-2">
                    {species.managementStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{strategy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Economic Impact</h3>
                  <p className="text-gray-700 leading-relaxed">{species.economicImpact}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Ecological Impact</h3>
                  <p className="text-gray-700 leading-relaxed">{species.ecologicalImpact}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Legal Status</h4>
                  <p className="text-gray-700">{species.legalStatus}</p>
                </div>
              </div>
            )}

            {activeTab === 'identification' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Identification Features</h3>
                  <div className="space-y-3">
                    {species.identification.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          ✓
                        </div>
                        <p className="text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Reporting</h4>
                  <p className="text-gray-700">{species.reporting}</p>
                </div>
              </div>
            )}

            {activeTab === 'prevention' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Prevention Tips</h3>
                  <div className="space-y-3">
                    {species.preventionTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-medium">
                          !
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
            </div>
          </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-blue-900 mb-2">Remember</h4>
                  <p className="text-blue-800 text-sm">
                    Early detection and rapid response are crucial for effective invasive species management. 
                    If you suspect you've found this species, report it immediately to your local authorities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Logo and Copyright */}
            <div className="md:col-span-1 flex flex-col items-start">
              <div className="flex flex-col items-start mb-3">
                <img src="/Invastop-Logo.png" alt="InvaStop" className="h-24 w-24 mb-2" />
              </div>
              <p className="text-green-100 text-sm">© 2025</p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-3 text-sm">Products</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Species Database</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Educational Resources</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Mapping Tools</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-sm">About Us</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Who We Are</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-sm">Contact Us</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="mailto:EnvironmentalHealth@hv.sistem.com" className="hover:text-white transition-colors">EnvironmentalHealth@hv.sistem.com</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Report an Issue</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default SpeciesDetailPage;
