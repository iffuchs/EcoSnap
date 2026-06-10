return function() {
  // @section:imports @depends:[]
  var React = require('react');
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useContext = React.useContext;
  var useMemo = React.useMemo;
  var useCallback = React.useCallback;
  var useRef = React.useRef;
  var RN = require('react-native');
  var View = RN.View;
  var Text = RN.Text;
  var StyleSheet = RN.StyleSheet;
  var ScrollView = RN.ScrollView;
  var FlatList = RN.FlatList;
  var TouchableOpacity = RN.TouchableOpacity;
  var TextInput = RN.TextInput;
  var Modal = RN.Modal;
  var Alert = RN.Alert;
  var Platform = RN.Platform;
  var StatusBar = RN.StatusBar;
  var ActivityIndicator = RN.ActivityIndicator;
  var Image = RN.Image;
  var Dimensions = RN.Dimensions;
  var KeyboardAvoidingView = RN.KeyboardAvoidingView;
  var Icons = require('@expo/vector-icons');
  var MaterialIcons = Icons.MaterialIcons;
  var Ionicons = Icons.Ionicons;
  var createBottomTabNavigator = require('@react-navigation/bottom-tabs').createBottomTabNavigator;
  var createStackNavigator = require('@react-navigation/stack').createStackNavigator;
  var useSafeAreaInsets = require('react-native-safe-area-context').useSafeAreaInsets;
  var platformHooks = require('platform-hooks');
  var useQuery = platformHooks.useQuery;
  var useMutation = platformHooks.useMutation;
  var useCamera = platformHooks.useCamera;
  var useLocation = platformHooks.useLocation;
  var useMaps = platformHooks.useMaps;
  var useShare = platformHooks.useShare;
  var _expoCam = null;
  try { _expoCam = require('expo-camera'); } catch (_e) {}
  var CameraViewComp = _expoCam ? (_expoCam.CameraView || _expoCam.Camera) : null;
  var _useCameraPerms = (_expoCam && _expoCam.useCameraPermissions) ||
    function() { return [{ granted: true, canAskAgain: false }, function() { return Promise.resolve({ granted: true }); }]; };
  // @end:imports

  // @section:theme @depends:[]
  var primaryColor = '#0F6E56';
  var accentColor = '#085041';
  var backgroundColor = '#FAFBF8';
  var cardColor = '#FFFFFF';
  var textPrimary = '#1F2937';
  var textSecondary = '#6B7280';
  var borderColor = '#EAE7DD';
  var designStyle = 'modern';
  var TAB_MENU_HEIGHT = Platform.OS === 'web' ? 56 : 49;
  var SCROLL_EXTRA_PADDING = 16;
  var WEB_TAB_MENU_PADDING = 90;
  var FAB_SPACING = 16;
  var HEADER_HEIGHT = 60;

  var ECO_SCORE_COLORS = {
    'a': '#1A9C3E',
    'b': '#5BB45F',
    'c': '#E9B300',
    'd': '#E8811A',
    'e': '#E63E11',
    'unknown': '#9CA3AF'
  };
  var ECO_SCORE_LABELS = {
    'a': 'Excellent',
    'b': 'Good',
    'c': 'Moderate',
    'd': 'Poor',
    'e': 'Very Poor',
    'unknown': 'Unknown'
  };
  var CO2_BY_GRADE = { 'a': 2.5, 'b': 1.2, 'c': 0.3, 'd': -0.8, 'e': -1.8 };

  var DEMO_BARCODES = [
    { code: '3017620422003', label: 'Nutella (Palm oil)' },
    { code: '7613034383518', label: 'Nestlé Milo' },
    { code: '3228857000166', label: 'Danone Activia' },
    { code: '3057640385148', label: 'Président Butter' },
    { code: '0737628064502', label: 'Organic Oat Milk' }
  ];

  var ALTERNATIVE_PRODUCTS = [
    { id: 'alt1', name: 'Organic Cocoa Spread', brand: 'Nocciolata', eco_grade: 'a', co2_kg: 0.8, image_key: 'organic-cocoa-spread-jar' },
    { id: 'alt2', name: 'Oat Milk Chocolate', brand: 'Oatly', eco_grade: 'b', co2_kg: 1.2, image_key: 'oat-milk-chocolate-drink' },
    { id: 'alt3', name: 'Fair Trade Almond Butter', brand: 'Meridian', eco_grade: 'a', co2_kg: 0.6, image_key: 'almond-butter-jar-organic' },
    { id: 'alt4', name: 'Bio Greek Yogurt', brand: 'Vrai', eco_grade: 'b', co2_kg: 1.1, image_key: 'greek-yogurt-organic-container' }
  ];

  var IMGBB_API_KEY = 'fcd482480633104788909bf22b46a590';
  // @end:theme

  // @section:navigation-setup @depends:[]
  var Tab = createBottomTabNavigator();
  var Stack = createStackNavigator();
  // @end:navigation-setup

  // @section:ThemeContext @depends:[theme]
  var ThemeContext = React.createContext({
    theme: {
      colors: {
        primary: primaryColor, accent: accentColor, background: backgroundColor,
        card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary,
        border: '#D1FAE5', success: '#10B981', error: '#EF4444', warning: '#F59E0B'
      }
    },
    darkMode: false,
    toggleDarkMode: function() {},
    inStoreMode: false,
    toggleInStoreMode: function() {}
  });

  var ThemeProvider = function(props) {
    var darkState = useState(false);
    var darkMode = darkState[0];
    var setDarkMode = darkState[1];
    var inStoreModeState = useState(false);
    var inStoreMode = inStoreModeState[0];
    var setInStoreMode = inStoreModeState[1];
    var lightTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor, accent: accentColor, background: backgroundColor,
          card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary,
          border: '#D1FAE5', success: '#10B981', error: '#EF4444', warning: '#F59E0B'
        }
      };
    }, []);
    var darkTheme = useMemo(function() {
      return {
        colors: {
          primary: '#10B981', accent: '#059669', background: '#064E3B',
          card: '#065F46', textPrimary: '#F9FAFB', textSecondary: '#A7F3D0',
          border: '#047857', success: '#10B981', error: '#EF4444', warning: '#F59E0B'
        }
      };
    }, []);
    var theme = darkMode ? darkTheme : lightTheme;
    var toggleDarkMode = useCallback(function() {
      setDarkMode(function(p) { return !p; });
    }, []);
    var toggleInStoreMode = useCallback(function() {
      setInStoreMode(function(p) { return !p; });
    }, []);
    var value = useMemo(function() {
      return { theme: theme, darkMode: darkMode, toggleDarkMode: toggleDarkMode, inStoreMode: inStoreMode, toggleInStoreMode: toggleInStoreMode };
    }, [theme, darkMode, toggleDarkMode, inStoreMode, toggleInStoreMode]);
    return React.createElement(ThemeContext.Provider, { value: value }, props.children);
  };

  var useTheme = function() { return useContext(ThemeContext); };
  // @end:ThemeContext

  // @section:fetch-utils @depends:[]
  function fetchWithTimeout(url, options, timeoutMs) {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, timeoutMs);
    var opts = Object.assign({}, options, { signal: controller.signal });
    return fetch(url, opts).then(
      function(response) { clearTimeout(timer); return response; },
      function(err) { clearTimeout(timer); throw err; }
    );
  }

  function fetchProductFromOpenFoodFacts(barcode, onSuccess, onError, onFinally) {
    var url = 'https://world.openfoodfacts.org/api/v2/product/' + barcode + '.json';
    fetchWithTimeout(url, { method: 'GET', headers: { 'User-Agent': 'EcoSnap/1.0' } }, 12000).then(
      function(resp) {
        if (!resp.ok) { throw new Error('HTTP ' + resp.status); }
        return resp.json();
      }
    ).then(
      function(data) {
        if (data.status === 1 && data.product) {
          var product = data.product;
          var normalized = {
            product_name: product.product_name || product.product_name_en || 'Unknown Product',
            brands: product.brands || 'Unknown Brand',
            image_front_url: product.image_front_url || product.image_url || null,
            ecoscore_grade: (product.ecoscore_grade || 'unknown').toLowerCase(),
            ecoscore_score: product.ecoscore_score || null,
            packaging: product.packaging || 'Not specified',
            origins: product.origins || 'Not specified',
            categories_tags: product.categories_tags || [],
            nutriscore_grade: product.nutriscore_grade || null
          };
          onSuccess(normalized);
        } else {
          onError('Product not found');
        }
        onFinally();
      },
      function(err) {
        onError(err.message || 'Network error');
        onFinally();
      }
    );
  }
  // @end:fetch-utils

  // @section:eco-utils @depends:[theme]
  function getEcoGrade(product) {
    if (!product) return 'unknown';
    var g = product.ecoscore_grade || product.nutriscore_grade || 'unknown';
    return g.toLowerCase();
  }

  function getEcoColor(grade) {
    return ECO_SCORE_COLORS[grade] || ECO_SCORE_COLORS['unknown'];
  }

  function getCO2ForGrade(grade) {
    return CO2_BY_GRADE[grade] !== undefined ? CO2_BY_GRADE[grade] : 0;
  }

  function formatCO2(val) {
    if (val === null || val === undefined) return '0';
    var num = parseFloat(val);
    if (isNaN(num)) return '0';
    return num.toFixed(1);
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function extractCategory(categoriesTags) {
    if (!categoriesTags || !Array.isArray(categoriesTags) || categoriesTags.length === 0) {
      return 'general';
    }
    var enTags = categoriesTags.filter(function(tag) { return tag.startsWith('en:'); });
    var selectedTag = enTags.length > 0 ? enTags[enTags.length - 1] : categoriesTags[0];
    return selectedTag.replace(/^[a-z]{2}:/, '');
  }

  function renderEcoBadge(grade, size) {
    var s = size || 'md';
    var dim = s === 'lg' ? 56 : s === 'sm' ? 32 : 44;
    var fs = s === 'lg' ? 22 : s === 'sm' ? 14 : 18;
    var color = getEcoColor(grade);
    return React.createElement(View, {
      style: {
        width: dim, height: dim, borderRadius: dim / 2,
        backgroundColor: color, alignItems: 'center', justifyContent: 'center',
        shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4
      }
    },
      React.createElement(Text, { style: { color: '#FFFFFF', fontSize: fs, fontWeight: 'bold' } },
        (grade === 'unknown' ? '?' : grade.toUpperCase())
      )
    );
  }
  // @end:eco-utils

  // @section:ScanResultModal @depends:[ThemeContext,eco-utils,styles]
  var ScanResultModal = function(props) {
    var visible = props.visible;
    var product = props.product;
    var onClose = props.onClose;
    var onSave = props.onSave;
    var onAlternatives = props.onAlternatives;
    var onReviews = props.onReviews;
    var barcode = props.barcode || '';
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var allReviews = [];
    var productReviews = [];
    var avgRating = productReviews.length > 0
      ? (productReviews.reduce(function(s, r) { return s + (r.rating || 0); }, 0) / productReviews.length).toFixed(1)
      : null;
    if (!product) return null;
    var grade = getEcoGrade(product);
    var gradeColor = getEcoColor(grade);
    var gradeLabel = ECO_SCORE_LABELS[grade] || 'Unknown';
    var co2 = getCO2ForGrade(grade);
    var productName = product.product_name || product.product_name_en || 'Unknown Product';
    var brand = product.brands || 'Unknown Brand';
    var category = extractCategory(product.categories_tags);
    return React.createElement(Modal, {
      visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose
    },
      React.createElement(View, {
        style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop }
      },
        React.createElement(View, {
          style: {
            flex: 1,
            backgroundColor: theme.colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
            paddingBottom: insetsBottom + 20, maxHeight: '90%'
          }
        },
          React.createElement(View, { style: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 } },
            React.createElement(View, { style: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border } })
          ),
          React.createElement(ScrollView, { style: { flex: 1 }, showsVerticalScrollIndicator: false },
            React.createElement(View, { style: { paddingHorizontal: 24, paddingBottom: 24 } },
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 } },
                React.createElement(View, { style: { flex: 1 } },
                  React.createElement(Text, { style: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 4 } }, productName),
                  React.createElement(Text, { style: { fontSize: 15, color: theme.colors.textSecondary, marginBottom: 4 } }, brand),
                  React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 } },
                    React.createElement(View, { style: { alignSelf: 'flex-start', backgroundColor: theme.colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, marginRight: 8 } },
                      React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, category)
                    ),
                    avgRating ? React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                      React.createElement(MaterialIcons, { name: 'star', size: 14, color: '#F59E0B' }),
                      React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, marginLeft: 2 } }, avgRating + ' (' + productReviews.length + ')')
                    ) : null
                  )
                ),
                React.createElement(View, { style: { alignItems: 'center', marginLeft: 16 } },
                  renderEcoBadge(grade, 'lg'),
                  React.createElement(Text, { style: { fontSize: 12, color: gradeColor, fontWeight: '600', marginTop: 4 } }, gradeLabel)
                )
              ),
              React.createElement(View, {
                style: {
                  backgroundColor: theme.colors.background, borderRadius: 16, padding: 16,
                  marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border
                }
              },
                React.createElement(Text, { style: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 } }, 'Environmental Impact'),
                React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                  React.createElement(View, { style: { alignItems: 'center', flex: 1 } },
                    React.createElement(Text, {
                      style: {
                        fontSize: 28, fontWeight: 'bold',
                        color: grade === 'a' || grade === 'b' ? theme.colors.success : (grade === 'c' ? '#E9B300' : theme.colors.error)
                      }
                    },
                      (co2 >= 0 ? '+' : '') + formatCO2(co2) + ' kg'
                    ),
                    React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center' } }, 'CO₂ vs avg choice')
                  ),
                  React.createElement(View, { style: { width: 1, backgroundColor: theme.colors.border } }),
                  React.createElement(View, { style: { alignItems: 'center', flex: 1 } },
                    React.createElement(View, {
                      style: {
                        width: 56, height: 56, borderRadius: 28, borderWidth: 4,
                        borderColor: gradeColor, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.card
                      }
                    },
                      React.createElement(Text, { style: { fontSize: 18, fontWeight: 'bold', color: gradeColor } }, 'A-E')
                    ),
                    React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 4 } }, 'Eco-Score Scale')
                  )
                )
              ),
              React.createElement(View, {
                style: {
                  backgroundColor: grade === 'unknown' ? '#FEF8E7' : (co2 >= 0 ? '#ECFDF5' : '#FEF2F2'),
                  borderRadius: 12, padding: 14, marginBottom: 20,
                  borderLeftWidth: 4, borderLeftColor: grade === 'unknown' ? '#E9B300' : (co2 >= 0 ? theme.colors.success : theme.colors.error)
                }
              },
                React.createElement(Text, { style: { fontSize: 13, color: grade === 'unknown' ? '#7C6F4A' : (co2 >= 0 ? '#065F46' : '#7F1D1D'), lineHeight: 20 } },
                  grade === 'unknown'
                    ? 'No Eco-Score data available for this product yet. Open Food Facts relies on community contributions — you could help by adding data at openfoodfacts.org.'
                    : co2 >= 0
                      ? 'Great choice! This product has a lower environmental impact. Choosing products like this helps reduce your carbon footprint.'
                      : 'This product has a higher environmental impact. Consider greener alternatives to reduce your footprint.'
                )
              ),
              React.createElement(TouchableOpacity, {
                style: {
                  backgroundColor: theme.colors.primary, borderRadius: 14, padding: 16,
                  alignItems: 'center', marginBottom: 12,
                  shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
                },
                onPress: onSave, componentId: 'save-scan-btn'
              },
                React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                  React.createElement(MaterialIcons, { name: 'bookmark-add', size: 20, color: '#FFFFFF' }),
                  React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 } }, 'Save to History')
                )
              ),
              React.createElement(TouchableOpacity, {
                style: {
                  backgroundColor: theme.colors.background, borderRadius: 14, padding: 16,
                  alignItems: 'center', borderWidth: 1.5, borderColor: theme.colors.primary, marginBottom: 12
                },
                onPress: onAlternatives, componentId: 'view-alternatives-btn'
              },
                React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                  React.createElement(MaterialIcons, { name: 'eco', size: 20, color: theme.colors.primary }),
                  React.createElement(Text, { style: { color: theme.colors.primary, fontSize: 16, fontWeight: '600', marginLeft: 8 } }, 'Find Greener Alternatives')
                )
              ),
              React.createElement(TouchableOpacity, {
                style: {
                  backgroundColor: theme.colors.background, borderRadius: 14, padding: 16,
                  alignItems: 'center', borderWidth: 1.5, borderColor: theme.colors.border, marginBottom: 12
                },
                onPress: onReviews, componentId: 'view-reviews-btn'
              },
                React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                  React.createElement(MaterialIcons, { name: 'chat-bubble-outline', size: 20, color: theme.colors.textSecondary }),
                  React.createElement(Text, { style: { color: theme.colors.textSecondary, fontSize: 16, fontWeight: '600', marginLeft: 8 } }, 'Community Tips' + (productReviews.length > 0 ? ' (' + productReviews.length + ')' : '') )
                )
              ),
              React.createElement(TouchableOpacity, {
                style: { padding: 14, alignItems: 'center' },
                onPress: onClose, componentId: 'close-scan-result-btn'
              },
                React.createElement(Text, { style: { color: theme.colors.textSecondary, fontSize: 15 } }, 'Dismiss')
              )
            )
          )
        )
      )
    );
  };
  // @end:ScanResultModal

  // @section:AlternativesModal @depends:[ThemeContext,eco-utils,styles]
  var AlternativesModal = function(props) {
    var visible = props.visible;
    var onClose = props.onClose;
    var onSaveAlt = props.onSaveAlt;
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;
    var category = props.category;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var alternatives = ALTERNATIVE_PRODUCTS.map(function(a) {
      return { id: a.id, name: a.name, brand: a.brand, eco_grade: a.eco_grade, co2_kg: a.co2_kg, category: 'general' };
    });
    var filteredAlts = category && category.length > 0
      ? alternatives.filter(function(alt) { return alt.category === category; })
      : alternatives;
    var displayAlts = filteredAlts.length > 0 ? filteredAlts : alternatives;
    return React.createElement(Modal, {
      visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose
    },
      React.createElement(View, {
        style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop }
      },
        React.createElement(View, {
          style: {
            flex: 1,
            backgroundColor: theme.colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
            paddingBottom: insetsBottom + 20, maxHeight: '80%'
          }
        },
          React.createElement(View, { style: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 } },
            React.createElement(View, { style: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border } })
          ),
          React.createElement(View, { style: { paddingHorizontal: 24, paddingBottom: 16 } },
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'eco', size: 24, color: theme.colors.primary }),
              React.createElement(Text, { style: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginLeft: 8 } }, 'Greener Alternatives')
            ),
            React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 } }, 'Products with better Eco-Scores for you')
          ),
          React.createElement(ScrollView, { style: { flex: 1 }, showsVerticalScrollIndicator: false,
            contentContainerStyle: { paddingHorizontal: 24, paddingBottom: 16 } },
            displayAlts.map(function(alt) {
              var color = getEcoColor(alt.eco_grade);
              return React.createElement(View, {
                key: alt.id,
                style: {
                  backgroundColor: theme.colors.background, borderRadius: 16, padding: 16, marginBottom: 12,
                  borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center'
                }
              },
                React.createElement(View, {
                  style: {
                    width: 52, height: 52, borderRadius: 12, backgroundColor: '#FFFFFF',
                    alignItems: 'center', justifyContent: 'center', marginRight: 14, overflow: 'hidden',
                    borderWidth: 1, borderColor: theme.colors.border
                  }
                },
                  React.createElement(MaterialIcons, { name: 'eco', size: 28, color: color })
                ),
                React.createElement(View, { style: { flex: 1 } },
                  React.createElement(Text, { style: { fontSize: 15, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 2 } }, alt.name),
                  React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 6 } }, alt.brand),
                  React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                    renderEcoBadge(alt.eco_grade, 'sm'),
                    React.createElement(Text, { style: { fontSize: 12, color: theme.colors.success, marginLeft: 8, fontWeight: '600' } },
                      '+' + formatCO2(alt.co2_kg) + ' kg CO₂ saved'
                    )
                  )
                ),
                React.createElement(TouchableOpacity, {
                  onPress: function() { onSaveAlt(alt); },
                  style: { padding: 8 }, componentId: 'save-alt-' + alt.id
                },
                  React.createElement(MaterialIcons, { name: 'add-circle', size: 28, color: theme.colors.primary })
                )
              );
            })
          ),
          React.createElement(TouchableOpacity, {
            style: { padding: 16, alignItems: 'center' },
            onPress: onClose, componentId: 'close-alternatives-btn'
          },
            React.createElement(Text, { style: { color: theme.colors.textSecondary, fontSize: 15 } }, 'Close')
          )
        )
      )
    );
  };
  // @end:AlternativesModal

  // @section:ReviewsModal @depends:[ThemeContext,eco-utils]
  var SESSION_REVIEWS = [];
  var ReviewsModal = function(props) {
    var visible = props.visible;
    var onClose = props.onClose;
    var barcode = props.barcode || '';
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;

    var sessionState = useState(SESSION_REVIEWS);
    var reviews = sessionState[0].filter(function(r) { return r.barcode === barcode; })
      .slice().sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });
    var setReviews = function(updater) {
      var newAll = typeof updater === 'function' ? updater(SESSION_REVIEWS) : updater;
      SESSION_REVIEWS = newAll;
      sessionState[1](newAll);
    };

    var ratingState = useState(5);
    var rating = ratingState[0];
    var setRating = ratingState[1];
    var commentState = useState('');
    var comment = commentState[0];
    var setComment = commentState[1];
    var submittingState = useState(false);
    var submitting = submittingState[0];
    var setSubmitting = submittingState[1];

    var handleSubmit = useCallback(function() {
      if (!comment.trim()) {
        Platform.OS === 'web' ? window.alert('Please write a comment.') : Alert.alert('Missing comment', 'Please write a comment.');
        return;
      }
      setSubmitting(true);
      var newReview = {
        id: generateUUID(), barcode: barcode, rating: rating,
        comment: comment.trim().slice(0, 280), author: 'You',
        created_at: new Date().toISOString()
      };
      setReviews(function(prev) { return prev.concat([newReview]); });
      setComment('');
      setRating(5);
      setSubmitting(false);
    }, [barcode, comment, rating]);

    var handleDelete = useCallback(function(id) {
      setReviews(function(prev) { return prev.filter(function(r) { return r.id !== id; }); });
    }, []);

    var renderStars = function(val, onStarPress) {
      return React.createElement(View, { style: { flexDirection: 'row' } },
        [1, 2, 3, 4, 5].map(function(n) {
          return React.createElement(TouchableOpacity, {
            key: String(n), onPress: onStarPress ? function() { onStarPress(n); } : null,
            style: { padding: 3 }, componentId: 'star-' + n
          },
            React.createElement(MaterialIcons, { name: n <= val ? 'star' : 'star-border', size: 22, color: '#F59E0B' })
          );
        })
      );
    };

    return React.createElement(Modal, { visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose },
      React.createElement(View, { style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop } },
        React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: insetsBottom + 20, maxHeight: '90%' } },
          React.createElement(View, { style: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 } },
            React.createElement(View, { style: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border } })
          ),
          React.createElement(View, { style: { paddingHorizontal: 24, paddingBottom: 16 } },
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'chat-bubble-outline', size: 24, color: theme.colors.primary }),
              React.createElement(Text, { style: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginLeft: 8 } }, 'Community Tips')
            ),
            React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 } }, String(reviews.length) + ' review' + (reviews.length !== 1 ? 's' : ''))
          ),
          React.createElement(ScrollView, { style: { flex: 1 }, showsVerticalScrollIndicator: false, contentContainerStyle: { paddingHorizontal: 24, paddingBottom: 16 } },
            React.createElement(View, { style: { backgroundColor: theme.colors.background, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border } },
              React.createElement(Text, { style: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 10 } }, 'Share your experience'),
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 } },
                React.createElement(Text, { style: { fontSize: 14, color: theme.colors.textSecondary, marginRight: 10 } }, 'Rating:'),
                renderStars(rating, setRating)
              ),
              React.createElement(TextInput, {
                style: { backgroundColor: theme.colors.card, borderRadius: 10, padding: 12, fontSize: 14, color: theme.colors.textPrimary, minHeight: 72, textAlignVertical: 'top', borderWidth: 1, borderColor: theme.colors.border },
                value: comment, onChangeText: function(t) { setComment(t.slice(0, 280)); },
                placeholder: 'Write a tip or review (max 280 chars)...', placeholderTextColor: theme.colors.textSecondary,
                multiline: true, componentId: 'review-input'
              }),
              React.createElement(Text, { style: { fontSize: 11, color: theme.colors.textSecondary, textAlign: 'right', marginTop: 4 } }, String(comment.length) + '/280'),
              React.createElement(TouchableOpacity, {
                style: { backgroundColor: submitting ? theme.colors.border : theme.colors.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10 },
                onPress: handleSubmit, disabled: submitting, componentId: 'submit-review-btn'
              },
                submitting
                  ? React.createElement(ActivityIndicator, { color: '#FFFFFF' })
                  : React.createElement(Text, { style: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 } }, 'Post Review')
              )
            ),
            reviews.length === 0
              ? React.createElement(Text, { style: { textAlign: 'center', color: theme.colors.textSecondary, fontSize: 14, paddingVertical: 16 } }, 'No reviews yet — be the first!')
              : null,
            reviews.map(function(r) {
              return React.createElement(View, {
                key: r.id,
                style: { backgroundColor: theme.colors.background, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border }
              },
                React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } },
                  React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                    React.createElement(View, { style: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.primary + '30', alignItems: 'center', justifyContent: 'center', marginRight: 8 } },
                      React.createElement(MaterialIcons, { name: 'person', size: 16, color: theme.colors.primary })
                    ),
                    React.createElement(Text, { style: { fontWeight: '700', color: theme.colors.textPrimary, fontSize: 14 } }, r.author)
                  ),
                  r.author === 'You'
                    ? React.createElement(TouchableOpacity, { onPress: function() { handleDelete(r.id); }, componentId: 'delete-review-' + r.id },
                        React.createElement(MaterialIcons, { name: 'delete-outline', size: 20, color: theme.colors.error })
                      )
                    : null
                ),
                renderStars(r.rating || 0, null),
                React.createElement(Text, { style: { fontSize: 14, color: theme.colors.textPrimary, marginTop: 6, lineHeight: 20 } }, r.comment),
                React.createElement(Text, { style: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 6 } }, new Date(r.created_at).toLocaleDateString())
              );
            })
          ),
          React.createElement(TouchableOpacity, { style: { padding: 16, alignItems: 'center' }, onPress: onClose, componentId: 'close-reviews-btn' },
            React.createElement(Text, { style: { color: theme.colors.textSecondary, fontSize: 15 } }, 'Close')
          )
        )
      )
    );
  };
  // @end:ReviewsModal

  // @section:ImpactScreen @depends:[ThemeContext,eco-utils,styles]
  var ImpactScreen = function() {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var scansQuery = useQuery('scans') || {};
    var scans = scansQuery.data || [];
    var favsQuery = useQuery('favorites') || {};
    var favs = favsQuery.data || [];
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var now = new Date();
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    var monthlyScans = useMemo(function() {
      return scans.filter(function(s) { return new Date(s.scanned_at) >= monthStart; });
    }, [scans]);

    var monthlyCO2 = useMemo(function() {
      return monthlyScans.reduce(function(sum, s) { return sum + (parseFloat(s.co2_kg) || 0); }, 0);
    }, [monthlyScans]);

    var chartData = useMemo(function() {
      var days = [];
      for (var i = 29; i >= 0; i--) {
        var d = new Date(now);
        d.setDate(d.getDate() - i);
        var dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        var dayEnd = new Date(dayStart.getTime() + 86400000);
        var val = scans.filter(function(s) {
          var t = new Date(s.scanned_at);
          return t >= dayStart && t < dayEnd;
        }).reduce(function(sum, s) { return sum + Math.max(0, parseFloat(s.co2_kg) || 0); }, 0);
        days.push(val);
      }
      return days;
    }, [scans]);

    var chartMax = useMemo(function() {
      return Math.max.apply(null, chartData.concat([0.1]));
    }, [chartData]);

    var sortedScans = useMemo(function() {
      return scans.slice().sort(function(a, b) { return new Date(a.scanned_at) - new Date(b.scanned_at); });
    }, [scans]);

    var totalCO2Saved = useMemo(function() {
      return scans.reduce(function(sum, s) { return sum + Math.max(0, parseFloat(s.co2_kg) || 0); }, 0);
    }, [scans]);

    var greenStreakMax = useMemo(function() {
      var streak = 0; var max = 0;
      sortedScans.forEach(function(s) {
        if (s.eco_grade === 'a' || s.eco_grade === 'b') { streak++; if (streak > max) max = streak; }
        else { streak = 0; }
      });
      return max;
    }, [sortedScans]);

    var distinctCategories = useMemo(function() {
      var cats = {};
      scans.forEach(function(s) { if (s.category) cats[s.category] = true; });
      return Object.keys(cats).length;
    }, [scans]);

    var BADGES = [
      { id: 'first-scan', title: 'First Scan', icon: 'qr-code-scanner', description: 'Scan 1 product', unlocked: scans.length >= 1 },
      { id: 'eco-curious', title: 'Eco Curious', icon: 'search', description: 'Scan 10 products', unlocked: scans.length >= 10 },
      { id: 'green-streak', title: 'Green Streak', icon: 'trending-up', description: '5 A/B grades in a row', unlocked: greenStreakMax >= 5 },
      { id: 'carbon-saver', title: 'Carbon Saver', icon: 'cloud', description: 'Save 10 kg CO₂', unlocked: totalCO2Saved >= 10 },
      { id: 'explorer', title: 'Explorer', icon: 'explore', description: '3 distinct categories', unlocked: distinctCategories >= 3 },
      { id: 'local-hero', title: 'Local Hero', icon: 'favorite', description: '3 saved alternatives', unlocked: favs.length >= 3 }
    ];

    var unlockedCount = BADGES.filter(function(b) { return b.unlocked; }).length;

    return React.createElement(ScrollView, { style: { flex: 1, backgroundColor: theme.colors.background }, contentContainerStyle: { paddingBottom: scrollBottomPadding } },
      React.createElement(View, { style: { backgroundColor: theme.colors.primary, paddingTop: insets.top + 16, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 } },
        React.createElement(Text, { style: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' } }, 'My Impact'),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } }, 'Your sustainability journey')
      ),
      // Monthly CO2 counter
      React.createElement(View, { style: { marginHorizontal: 20, marginTop: -20, backgroundColor: theme.colors.card, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6, borderWidth: 1, borderColor: theme.colors.border } },
        React.createElement(Text, { style: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 } }, 'This Month'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
          React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
            React.createElement(Text, { style: { fontSize: 36, fontWeight: 'bold', color: monthlyCO2 >= 0 ? theme.colors.success : theme.colors.error } }, (monthlyCO2 >= 0 ? '+' : '') + formatCO2(monthlyCO2)),
            React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 } }, 'kg CO₂ saved')
          ),
          React.createElement(View, { style: { width: 1, backgroundColor: theme.colors.border } }),
          React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
            React.createElement(Text, { style: { fontSize: 36, fontWeight: 'bold', color: theme.colors.primary } }, String(monthlyScans.length)),
            React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 } }, 'scans this month')
          )
        )
      ),
      // 30-day bar chart (built from View elements — no chart library)
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 20, backgroundColor: theme.colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border } },
        React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 14 } }, '30-Day CO₂ Trend'),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'flex-end', height: 80 } },
          chartData.map(function(val, idx) {
            var barH = chartMax > 0 ? Math.max(3, Math.round((val / chartMax) * 72)) : 3;
            var isToday = idx === 29;
            return React.createElement(View, { key: String(idx), style: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 80, marginHorizontal: 1 } },
              React.createElement(View, { style: { width: '100%', height: barH, backgroundColor: isToday ? theme.colors.primary : (val > 0 ? theme.colors.success : theme.colors.border), borderRadius: 2 } })
            );
          })
        ),
        React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 } },
          React.createElement(Text, { style: { fontSize: 10, color: theme.colors.textSecondary } }, '30d ago'),
          React.createElement(Text, { style: { fontSize: 10, color: theme.colors.textSecondary } }, 'Today')
        )
      ),
      // Achievement badges
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 20 } },
        React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } },
          React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary } }, 'Achievement Badges'),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary } }, String(unlockedCount) + '/' + String(BADGES.length) + ' unlocked')
        ),
        React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 } },
          BADGES.map(function(badge) {
            return React.createElement(View, { key: badge.id, style: { width: '33.33%', paddingHorizontal: 6, marginBottom: 12 } },
              React.createElement(View, {
                style: { backgroundColor: badge.unlocked ? theme.colors.card : theme.colors.background, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: badge.unlocked ? theme.colors.primary : theme.colors.border, opacity: badge.unlocked ? 1 : 0.55 }
              },
                React.createElement(View, { style: { width: 44, height: 44, borderRadius: 22, backgroundColor: badge.unlocked ? theme.colors.primary + '25' : theme.colors.border + '80', alignItems: 'center', justifyContent: 'center', marginBottom: 8 } },
                  React.createElement(MaterialIcons, { name: badge.icon, size: 24, color: badge.unlocked ? theme.colors.primary : theme.colors.textSecondary })
                ),
                React.createElement(Text, { style: { fontSize: 11, fontWeight: '700', color: badge.unlocked ? theme.colors.textPrimary : theme.colors.textSecondary, textAlign: 'center', marginBottom: 4 } }, badge.title),
                React.createElement(Text, { style: { fontSize: 10, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 14 } }, badge.description),
                badge.unlocked ? React.createElement(View, { style: { marginTop: 6, backgroundColor: theme.colors.success + '25', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 } },
                  React.createElement(Text, { style: { fontSize: 9, color: theme.colors.success, fontWeight: '800', letterSpacing: 0.5 } }, 'UNLOCKED')
                ) : null
              )
            );
          })
        )
      )
    );
  };
  // @end:ImpactScreen

  // @section:HomeScreen @depends:[ThemeContext,styles,eco-utils]
  var HomeScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var scansQuery = useQuery('scans') || {};
    var scans = scansQuery.data || [];
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var totalCO2 = useMemo(function() {
      return scans.reduce(function(sum, s) {
        return sum + (parseFloat(s.co2_kg) || 0);
      }, 0);
    }, [scans]);

    var greenCount = useMemo(function() {
      return scans.filter(function(s) { return s.eco_grade === 'a' || s.eco_grade === 'b'; }).length;
    }, [scans]);

    var recentScans = useMemo(function() {
      var sorted = scans.slice().sort(function(a, b) {
        return new Date(b.scanned_at) - new Date(a.scanned_at);
      });
      return sorted.slice(0, 3);
    }, [scans]);

    return React.createElement(ScrollView, {
      style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingBottom: scrollBottomPadding }
    },
      React.createElement(View, {
        style: {
          backgroundColor: theme.colors.primary, paddingTop: insets.top + 16,
          paddingBottom: 32, paddingHorizontal: 24,
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32
        }
      },
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
          React.createElement(MaterialIcons, { name: 'eco', size: 28, color: '#FFFFFF' }),
          React.createElement(Text, { style: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 8 } }, 'EcoSnap')
        ),
        React.createElement(Text, { style: { fontSize: 14, color: 'rgba(255,255,255,0.8)' } }, 'Your sustainability companion')
      ),
      React.createElement(View, {
        style: {
          flexDirection: 'row', marginHorizontal: 20, marginTop: -28,
          backgroundColor: theme.colors.card, borderRadius: 20, padding: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6
        }
      },
        React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
          React.createElement(Text, { style: { fontSize: 32, fontWeight: 'bold', color: totalCO2 >= 0 ? theme.colors.success : theme.colors.error } },
            (totalCO2 >= 0 ? '+' : '') + formatCO2(totalCO2)
          ),
          React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, 'kg CO₂ saved')
        ),
        React.createElement(View, { style: { width: 1, backgroundColor: theme.colors.border } }),
        React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
          React.createElement(Text, { style: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary } }, String(scans.length)),
          React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, 'Total scans')
        ),
        React.createElement(View, { style: { width: 1, backgroundColor: theme.colors.border } }),
        React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
          React.createElement(Text, { style: { fontSize: 32, fontWeight: 'bold', color: ECO_SCORE_COLORS['b'] } }, String(greenCount)),
          React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, 'Eco choices')
        )
      ),
      React.createElement(TouchableOpacity, {
        style: {
          marginHorizontal: 20, marginTop: 20, backgroundColor: theme.colors.primary, borderRadius: 18,
          padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8
        },
        onPress: function() { navigation.navigate('Scan'); }, componentId: 'home-scan-cta'
      },
        React.createElement(MaterialIcons, { name: 'qr-code-scanner', size: 28, color: '#FFFFFF' }),
        React.createElement(Text, { style: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 12 } }, 'Scan a Product')
      ),
      React.createElement(View, { style: { paddingHorizontal: 20, marginTop: 24 } },
        React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } },
          React.createElement(Text, { style: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary } }, 'Recent Scans'),
          React.createElement(TouchableOpacity, { onPress: function() { navigation.navigate('History'); }, componentId: 'home-view-all-btn' },
            React.createElement(Text, { style: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' } }, 'View All')
          )
        ),
        recentScans.length === 0
          ? React.createElement(View, {
              style: {
                backgroundColor: theme.colors.card, borderRadius: 16, padding: 32,
                alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed'
              }
            },
              React.createElement(MaterialIcons, { name: 'qr-code-scanner', size: 48, color: theme.colors.border }),
              React.createElement(Text, { style: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 12, textAlign: 'center' } }, 'No scans yet\nScan a product to get started!')
            )
          : recentScans.map(function(scan) {
              var col = getEcoColor(scan.eco_grade || 'unknown');
              return React.createElement(View, {
                key: scan.id,
                style: {
                  backgroundColor: theme.colors.card, borderRadius: 14, padding: 14,
                  marginBottom: 10, flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1, borderColor: theme.colors.border,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2
                }
              },
                React.createElement(View, {
                  style: {
                    width: 44, height: 44, borderRadius: 12, backgroundColor: col + '20',
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }
                },
                  renderEcoBadge(scan.eco_grade || 'unknown', 'sm')
                ),
                React.createElement(View, { style: { flex: 1 } },
                  React.createElement(Text, { style: { fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }, numberOfLines: 1 }, scan.product_name || 'Unknown'),
                  React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary } }, scan.brand || 'Unknown Brand')
                ),
                React.createElement(Text, {
                  style: {
                    fontSize: 13, fontWeight: '600',
                    color: parseFloat(scan.co2_kg) >= 0 ? theme.colors.success : theme.colors.error
                  }
                }, (parseFloat(scan.co2_kg) >= 0 ? '+' : '') + formatCO2(scan.co2_kg) + ' kg')
              );
            })
      ),
      React.createElement(View, { style: { paddingHorizontal: 20, marginTop: 20 } },
        React.createElement(Text, { style: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 14 } }, 'Eco Tips'),
        React.createElement(View, {
          style: {
            backgroundColor: '#ECFDF5', borderRadius: 16, padding: 16,
            borderLeftWidth: 4, borderLeftColor: theme.colors.primary
          }
        },
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'flex-start' } },
            React.createElement(MaterialIcons, { name: 'lightbulb', size: 20, color: theme.colors.primary, style: { marginTop: 2 } }),
            React.createElement(Text, { style: { flex: 1, fontSize: 14, color: '#065F46', lineHeight: 22, marginLeft: 10 } },
              'Look for products with Eco-Score A or B. They have a significantly lower environmental impact through sustainable sourcing, lower packaging, and shorter supply chains.'
            )
          )
        )
      )
    );
  };
  // @end:HomeScreen

  // @section:ScanScreen @depends:[ThemeContext,styles,eco-utils,ScanResultModal,AlternativesModal]
  var ScanScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var cameraHook = useCamera();
    var takePhoto = cameraHook.takePhoto;
    var photo = cameraHook.photo;
    var shareHook = useShare();
    var share = shareHook.share;
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var scansQuery = useQuery('scans') || {};
    var refetchScans = scansQuery.refetch || function() {};
    var insertScanMutation = useMutation('scans', 'insert') || {};
    var insertScan = insertScanMutation.mutate || function() { return Promise.resolve(); };
    var insertFavMutation = useMutation('favorites', 'insert') || {};
    var insertFav = insertFavMutation.mutate || function() { return Promise.resolve(); };

    var barcodeState = useState('');
    var barcode = barcodeState[0];
    var setBarcode = barcodeState[1];
    var loadingState = useState(false);
    var loading = loadingState[0];
    var setLoading = loadingState[1];
    var errorState = useState(null);
    var scanError = errorState[0];
    var setScanError = errorState[1];
    var resultState = useState(null);
    var scanResult = resultState[0];
    var setScanResult = resultState[1];
    var showResultState = useState(false);
    var showResult = showResultState[0];
    var setShowResult = showResultState[1];
    var showAltState = useState(false);
    var showAlt = showAltState[0];
    var setShowAlt = showAltState[1];
    var savedState = useState(false);
    var saved = savedState[0];
    var setSaved = savedState[1];
    var showReviewsState = useState(false);
    var showReviews = showReviewsState[0];
    var setShowReviews = showReviewsState[1];
    var nfcLoadingState = useState(false);
    var nfcLoading = nfcLoadingState[0];
    var setNfcLoading = nfcLoadingState[1];
    var scanStageState = useState('');
    var scanStage = scanStageState[0];
    var setScanStage = scanStageState[1];
    var showCameraState = useState(false);
    var showCamera = showCameraState[0];
    var setShowCamera = showCameraState[1];
    var scannedState = useState(false);
    var scanned = scannedState[0];
    var setScanned = scannedState[1];
    var _camPerm = _useCameraPerms();
    var cameraPermission = _camPerm[0];
    var requestCameraPermission = _camPerm[1];

    // Simulates an NFC NDEF read — production would call NFC.requestTechnology() and parse NDEF records.
    var handleNfcTap = useCallback(function() {
      setNfcLoading(true);
      setTimeout(function() {
        var randomDemo = DEMO_BARCODES[Math.floor(Math.random() * DEMO_BARCODES.length)];
        setBarcode(randomDemo.code);
        setScanError(null);
        setNfcLoading(false);
      }, 1500);
    }, []);

    var handleBarcodeScan = useCallback(function() {
      if (!barcode.trim()) {
        Platform.OS === 'web'
          ? window.alert('Please enter a barcode number')
          : Alert.alert('Missing Barcode', 'Please enter a barcode number');
        return;
      }
      setLoading(true);
      setScanError(null);
      setSaved(false);
      fetchProductFromOpenFoodFacts(
        barcode.trim(),
        function(product) {
          setScanResult(product);
          setShowResult(true);
        },
        function(err) {
          setScanError('Could not fetch product data. Please try again. (' + err + ')');
        },
        function() { setLoading(false); }
      );
    }, [barcode]);

          var handleSaveScan = useCallback(function() {
      if (!scanResult) return;
      var grade = getEcoGrade(scanResult);
      var co2 = getCO2ForGrade(grade);
      var productName = scanResult.product_name || scanResult.product_name_en || 'Unknown Product';
      var category = extractCategory(scanResult.categories_tags);
      insertScan({
        id: generateUUID(),
        barcode: barcode,
        product_name: productName,
        brand: scanResult.brands || 'Unknown Brand',
        eco_grade: grade,
        co2_kg: co2,
        category: category,
        scanned_at: new Date().toISOString()
      }).then(function() {
        refetchScans();
        setSaved(true);
        Platform.OS === 'web'
          ? window.alert('Scan saved to history!')
          : Alert.alert('Saved!', 'Product added to your scan history.');
      }).catch(function(err) {
        Platform.OS === 'web'
          ? window.alert('Error saving: ' + err.message)
          : Alert.alert('Error', err.message);
      });
    }, [scanResult, barcode, insertScan, refetchScans]);

    var handleSaveAlt = useCallback(function(alt) {
      insertFav({
        id: generateUUID(),
        product_name: alt.name,
        brand: alt.brand,
        eco_grade: alt.eco_grade,
        co2_kg: alt.co2_kg,
        barcode: '',
        created_at: new Date().toISOString()
      }).then(function() {
        setShowAlt(false);
        Platform.OS === 'web'
          ? window.alert(alt.name + ' saved to favorites!')
          : Alert.alert('Saved!', alt.name + ' added to your favorites.');
      }).catch(function(err) {
        Platform.OS === 'web' ? window.alert(err.message) : Alert.alert('Error', err.message);
      });
    }, [insertFav]);

    var handleOpenCamera = useCallback(function() {
      setScanError(null);
      if (!CameraViewComp) {
        setScanError('Camera scanner unavailable in this environment. Enter the barcode manually or tap a demo barcode below.');
        return;
      }
      if (cameraPermission && cameraPermission.granted === false && !cameraPermission.canAskAgain) {
        setScanError('Camera permission denied. Enable it in device Settings, then try again.');
        return;
      }
      if (cameraPermission && !cameraPermission.granted) {
        requestCameraPermission().then(function(result) {
          if (result && result.granted) { setScanned(false); setShowCamera(true); }
          else { setScanError('Camera permission required to scan. Enter barcode manually.'); }
        });
        return;
      }
      setScanned(false);
      setShowCamera(true);
    }, [cameraPermission, requestCameraPermission]);

    var handleBarCodeScanned = useCallback(function(result) {
      if (scanned || !result || !result.data) return;
      var data = String(result.data).trim();
      if (!data) return;
      setScanned(true);
      setShowCamera(false);
      setBarcode(data);
      setLoading(true);
      setScanError(null);
      setSaved(false);
      setScanStage('Looking up product…');
      fetchProductFromOpenFoodFacts(
        data,
        function(product) { setScanResult(product); setShowResult(true); setLoading(false); setScanStage(''); },
        function() { setScanError('Barcode ' + data + ' not found in Open Food Facts.'); setLoading(false); setScanStage(''); },
        function() {}
      );
    }, [scanned]);

    var handleShare = useCallback(function() {
      if (!scanResult) return;
      var productName = scanResult.product_name || 'Unknown Product';
      var grade = getEcoGrade(scanResult);
      share({ message: 'I checked ' + productName + ' on EcoSnap — Eco-Score: ' + grade.toUpperCase() + '. Make greener choices!' });
    }, [scanResult, share]);

    var scrollH = Dimensions.get('window').height - insets.top - insets.bottom - 56;

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background } },
      React.createElement(View, {
        style: {
          backgroundColor: theme.colors.primary, paddingTop: insets.top + 16,
          paddingBottom: 20, paddingHorizontal: 24
        }
      },
        React.createElement(Text, { style: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' } }, 'Scan Product'),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } }, 'Enter barcode to check Eco-Score')
      ),
      React.createElement(ScrollView, {
        style: Platform.OS === 'web' ? { height: scrollH, overflow: 'auto' } : { flex: 1 },
        contentContainerStyle: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: scrollBottomPadding }
      },
        React.createElement(View, {
          style: {
            backgroundColor: theme.colors.card, borderRadius: 20, padding: 20, marginBottom: 16,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
            borderWidth: 1, borderColor: theme.colors.border
          }
        },
          React.createElement(View, { style: { marginBottom: 16 } },
            React.createElement(TouchableOpacity, {
              style: { height: 160, borderRadius: 14, borderWidth: 2, borderColor: theme.colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, marginBottom: 10 },
              onPress: handleOpenCamera, disabled: loading || showCamera, componentId: 'camera-viewfinder'
            },
              React.createElement(MaterialIcons, { name: 'camera-alt', size: 48, color: theme.colors.textSecondary }),
              React.createElement(Text, { style: { color: theme.colors.textSecondary, marginTop: 8, fontSize: 14 } }, 'Scan Barcode')
            ),
            React.createElement(TouchableOpacity, {
              style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED20', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#7C3AED' },
              onPress: handleNfcTap, disabled: nfcLoading, componentId: 'nfc-tap-btn'
            },
              React.createElement(MaterialIcons, { name: 'nfc', size: 20, color: '#7C3AED' }),
              React.createElement(Text, { style: { color: '#7C3AED', fontSize: 13, fontWeight: '600', marginLeft: 6 } }, 'NFC Tap')
            )
          ),
          React.createElement(View, {
            style: {
              flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background,
              borderRadius: 12, borderWidth: 1.5, borderColor: theme.colors.border, paddingHorizontal: 14, marginBottom: 14
            }
          },
            React.createElement(MaterialIcons, { name: 'qr-code', size: 20, color: theme.colors.textSecondary }),
            React.createElement(TextInput, {
              style: { flex: 1, fontSize: 16, color: theme.colors.textPrimary, paddingVertical: 14, paddingHorizontal: 10 },
              value: barcode, onChangeText: function(t) { setBarcode(t.replace(/[^0-9]/g, '')); },
              placeholder: 'Enter barcode number...', placeholderTextColor: theme.colors.textSecondary,
              keyboardType: 'numeric', autoCorrect: false, autoCapitalize: 'none',
              componentId: 'barcode-input'
            }),
            barcode.length > 0
              ? React.createElement(TouchableOpacity, {
                  onPress: function() { setBarcode(''); }, componentId: 'clear-barcode-btn', style: { padding: 4 }
                },
                  React.createElement(MaterialIcons, { name: 'cancel', size: 20, color: theme.colors.textSecondary })
                )
              : null
          ),
          React.createElement(TouchableOpacity, {
            style: {
              backgroundColor: loading ? theme.colors.border : theme.colors.primary,
              borderRadius: 12, padding: 16, alignItems: 'center',
              shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
            },
            onPress: handleBarcodeScan, disabled: loading, componentId: 'lookup-btn'
          },
            loading
              ? React.createElement(ActivityIndicator, { color: '#FFFFFF', componentId: 'scan-loader' })
              : React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                  React.createElement(MaterialIcons, { name: 'search', size: 20, color: '#FFFFFF' }),
                  React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 } }, 'Look Up Eco-Score')
                )
          ),
          scanError
            ? React.createElement(View, {
                style: {
                  backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginTop: 12,
                  borderLeftWidth: 3, borderLeftColor: theme.colors.error
                }
              },
                React.createElement(Text, { style: { fontSize: 13, color: '#7F1D1D' } }, scanError)
              )
            : null
        ),
        React.createElement(View, { style: { marginBottom: 16 } },
          React.createElement(Text, { style: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 12 } }, 'Try Demo Barcodes'),
          DEMO_BARCODES.map(function(db) {
            return React.createElement(TouchableOpacity, {
              key: db.code,
              style: {
                backgroundColor: theme.colors.card, borderRadius: 12, padding: 14, marginBottom: 8,
                flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border
              },
              onPress: function() { setBarcode(db.code); setScanError(null); },
              componentId: 'demo-' + db.code
            },
              React.createElement(View, {
                style: {
                  width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.primary + '20',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }
              },
                React.createElement(MaterialIcons, { name: 'qr-code', size: 18, color: theme.colors.primary })
              ),
              React.createElement(View, { style: { flex: 1 } },
                React.createElement(Text, { style: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary } }, db.label),
                React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, db.code)
              ),
              React.createElement(MaterialIcons, { name: 'chevron-right', size: 20, color: theme.colors.textSecondary })
            );
          })
        ),
        scanResult && saved
          ? React.createElement(TouchableOpacity, {
              style: {
                backgroundColor: '#ECFDF5', borderRadius: 12, padding: 14,
                flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.success, marginBottom: 16
              },
              onPress: function() { setShowResult(true); }, componentId: 'reopen-result-btn'
            },
              React.createElement(MaterialIcons, { name: 'check-circle', size: 22, color: theme.colors.success }),
              React.createElement(Text, { style: { flex: 1, fontSize: 15, color: '#065F46', fontWeight: '600', marginHorizontal: 10 } },
                (scanResult.product_name || 'Product') + ' — tap to view'
              ),
              React.createElement(TouchableOpacity, { onPress: handleShare, componentId: 'share-result-btn', style: { padding: 4 } },
                React.createElement(MaterialIcons, { name: 'share', size: 20, color: theme.colors.textSecondary })
              )
            )
          : null
      ),
      loading && scanStage ? React.createElement(View, {
        style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,110,86,0.92)', alignItems: 'center', justifyContent: 'center', zIndex: 100 }
      },
        React.createElement(ActivityIndicator, { color: '#FFFFFF', size: 'large' }),
        React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 16 } }, scanStage),
        React.createElement(Text, { style: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6 } }, 'Hold steady…')
      ) : null,
      nfcLoading ? React.createElement(View, {
        style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(124,58,237,0.85)', alignItems: 'center', justifyContent: 'center', zIndex: 100 }
      },
        React.createElement(ActivityIndicator, { color: '#FFFFFF', size: 'large', componentId: 'nfc-loader' }),
        React.createElement(Text, { style: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 16 } }, 'Reading NFC tag...'),
        React.createElement(Text, { style: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6 } }, 'Hold device near tag')
      ) : null,
      CameraViewComp ? React.createElement(Modal, {
        visible: showCamera,
        animationType: 'slide',
        transparent: false,
        onRequestClose: function() { setShowCamera(false); setScanned(false); }
      },
        React.createElement(View, { style: { flex: 1, backgroundColor: '#000' } },
          React.createElement(CameraViewComp, {
            style: { flex: 1 },
            facing: 'back',
            type: 'back',
            onBarcodeScanned: scanned ? undefined : handleBarCodeScanned,
            onBarCodeScanned: scanned ? undefined : handleBarCodeScanned,
            barcodeSettings: { barcodeTypes: ['ean13', 'ean8', 'qr', 'code128', 'upc_a', 'upc_e', 'itf14', 'pdf417', 'aztec', 'code39', 'code93'] },
            barCodeScannerSettings: { barCodeTypes: ['ean13', 'ean8', 'qr', 'code128', 'upc_a', 'upc_e', 'itf14', 'pdf417', 'aztec', 'code39', 'code93'] }
          }),
          React.createElement(View, {
            style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }
          },
            React.createElement(View, { style: { width: 260, height: 200, borderRadius: 16, borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' } }),
            React.createElement(Text, {
              style: { color: '#FFFFFF', fontSize: 14, marginTop: 20, textAlign: 'center', paddingHorizontal: 40,
                       textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }
            }, 'Point camera at any barcode or QR code')
          ),
          React.createElement(TouchableOpacity, {
            style: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 24, padding: 10 },
            onPress: function() { setShowCamera(false); setScanned(false); }
          },
            React.createElement(MaterialIcons, { name: 'arrow-back', size: 28, color: '#FFFFFF' })
          )
        )
      ) : null,
      React.createElement(ScanResultModal, {
        visible: showResult,
        product: scanResult,
        barcode: barcode,
        onClose: function() { setShowResult(false); },
        onSave: function() { setShowResult(false); handleSaveScan(); },
        onAlternatives: function() { setShowResult(false); setShowAlt(true); },
        onReviews: function() { setShowResult(false); setShowReviews(true); },
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      }),
      React.createElement(AlternativesModal, {
        visible: showAlt,
        onClose: function() { setShowAlt(false); },
        onSaveAlt: handleSaveAlt,
        category: scanResult ? extractCategory(scanResult.categories_tags) : null,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      }),
      React.createElement(ReviewsModal, {
        visible: showReviews,
        onClose: function() { setShowReviews(false); },
        barcode: barcode,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      })
    );
  };
  // @end:ScanScreen

  // @section:HistoryScreen @depends:[ThemeContext,styles,eco-utils]
  var HistoryScreen = function(props) {
    var navigation = props.navigation;
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var scansQuery = useQuery('scans') || {};
    var scans = scansQuery.data || [];
    var loading = scansQuery.loading || false;
    var refetchScans = scansQuery.refetch || function() {};
    var deleteScanMutation = useMutation('scans', 'delete') || {};
    var deleteScan = deleteScanMutation.mutate || function() { return Promise.resolve(); };
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var sortedScans = useMemo(function() {
      return scans.slice().sort(function(a, b) {
        return new Date(b.scanned_at) - new Date(a.scanned_at);
      });
    }, [scans]);

    var totalCO2 = useMemo(function() {
      return scans.reduce(function(s, sc) { return s + (parseFloat(sc.co2_kg) || 0); }, 0);
    }, [scans]);

    var handleDelete = useCallback(function(scanId) {
      var doDelete = function() {
        deleteScan({ id: scanId }).then(function() {
          refetchScans();
        }).catch(function(err) {
          Platform.OS === 'web' ? window.alert(err.message) : Alert.alert('Error', err.message);
        });
      };
      if (Platform.OS === 'web') {
        if (window.confirm('Remove this scan from history?')) { doDelete(); }
      } else {
        Alert.alert('Remove Scan', 'Remove this product from your history?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: doDelete }
        ]);
      }
    }, [deleteScan, refetchScans]);

    var renderItem = function(item) {
      var scan = item.item;
      var grade = scan.eco_grade || 'unknown';
      var col = getEcoColor(grade);
      var date = scan.scanned_at ? new Date(scan.scanned_at).toLocaleDateString() : '';
      return React.createElement(View, {
        style: {
          backgroundColor: theme.colors.card, borderRadius: 16, padding: 16, marginBottom: 10,
          marginHorizontal: 20, flexDirection: 'row', alignItems: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
          borderWidth: 1, borderColor: theme.colors.border
        },
        componentId: 'history-item-' + scan.id
      },
        renderEcoBadge(grade, 'md'),
        React.createElement(View, { style: { flex: 1, marginLeft: 14 } },
          React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary }, numberOfLines: 1 }, scan.product_name || 'Unknown'),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 } }, scan.brand || 'Unknown Brand'),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 6 } },
            React.createElement(View, {
              style: {
                paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
                backgroundColor: col + '20'
              }
            },
              React.createElement(Text, { style: { fontSize: 11, color: col, fontWeight: '700' } }, 'ECO ' + grade.toUpperCase())
            ),
            React.createElement(Text, {
              style: {
                fontSize: 12, marginLeft: 8, fontWeight: '600',
                color: parseFloat(scan.co2_kg) >= 0 ? theme.colors.success : theme.colors.error
              }
            }, (parseFloat(scan.co2_kg) >= 0 ? '+' : '') + formatCO2(scan.co2_kg) + ' kg CO₂'),
            React.createElement(Text, { style: { fontSize: 11, color: theme.colors.textSecondary, marginLeft: 8 } }, date)
          )
        ),
        React.createElement(TouchableOpacity, {
          onPress: function() { handleDelete(scan.id); },
          style: { padding: 8 }, componentId: 'delete-scan-' + scan.id
        },
          React.createElement(MaterialIcons, { name: 'delete-outline', size: 22, color: theme.colors.error })
        )
      );
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background } },
      React.createElement(View, {
        style: {
          backgroundColor: theme.colors.primary, paddingTop: insets.top + 16,
          paddingBottom: 20, paddingHorizontal: 24
        }
      },
        React.createElement(Text, { style: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' } }, 'Scan History'),
        React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } },
          String(scans.length) + ' products scanned'
        )
      ),
      scans.length > 0
        ? React.createElement(View, {
            style: {
              marginHorizontal: 20, marginTop: -20, backgroundColor: theme.colors.card,
              borderRadius: 16, padding: 16, marginBottom: 16,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
            }
          },
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'cloud', size: 24, color: totalCO2 >= 0 ? theme.colors.success : theme.colors.error }),
              React.createElement(Text, { style: { fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary, marginLeft: 8 } }, 'Total CO₂ Impact')
            ),
            React.createElement(Text, {
              style: {
                fontSize: 20, fontWeight: 'bold',
                color: totalCO2 >= 0 ? theme.colors.success : theme.colors.error
              }
            }, (totalCO2 >= 0 ? '+' : '') + formatCO2(totalCO2) + ' kg')
          )
        : null,
      loading
        ? React.createElement(ActivityIndicator, { style: { flex: 1, marginTop: 40 }, color: theme.colors.primary, componentId: 'history-loader' })
        : sortedScans.length === 0
          ? React.createElement(View, {
              style: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: scrollBottomPadding }
            },
              React.createElement(MaterialIcons, { name: 'history', size: 64, color: theme.colors.border }),
              React.createElement(Text, { style: { fontSize: 18, color: theme.colors.textSecondary, marginTop: 16, fontWeight: '600' } }, 'No scan history yet'),
              React.createElement(Text, { style: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 } }, 'Start scanning products!')
            )
          : React.createElement(FlatList, {
              data: sortedScans,
              keyExtractor: function(item) { return item.id; },
              renderItem: renderItem,
              contentContainerStyle: { paddingTop: scans.length > 0 ? 8 : 20, paddingBottom: scrollBottomPadding },
              showsVerticalScrollIndicator: false
            })
    );
  };
  // @end:HistoryScreen

  // @section:MapScreen @depends:[ThemeContext,styles]
  var GREAT_CIRCLE_DIST = function(lat1, lng1, lat2, lng2) {
    var R = 6371000;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Simulated BLE beacon suggestions for in-store mode
  var BLE_BEACONS = [
    { id: 'b1', aisle: 'Dairy Aisle', tip: "You're near the dairy aisle — try Oatly oat milk for a lower footprint." },
    { id: 'b2', aisle: 'Snacks Aisle', tip: "Snacks aisle detected — look for Nocciolata as a greener spread." },
    { id: 'b3', aisle: 'Beverages', tip: "Beverages section nearby — choose sparkling water over soft drinks." }
  ];

  var MapScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var inStoreMode = themeCtx.inStoreMode;
    var insets = useSafeAreaInsets();
    var locationHook = useLocation();
    var getCurrentLocation = locationHook.getCurrentLocation;
    var reverseGeocode = locationHook.reverseGeocode;
    var mapsHook = useMaps({ latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.05, longitudeDelta: 0.05 });
    var MapView = mapsHook.MapView;
    var Marker = mapsHook.Marker;
    var Callout = mapsHook.Callout;
    var region = mapsHook.region;
    var setRegion = mapsHook.setRegion;
    var markers = mapsHook.markers;
    var addMarker = mapsHook.addMarker;
    var clearMarkers = mapsHook.clearMarkers;
    var animateToRegion = mapsHook.animateToRegion;
    var mapRef = mapsHook.mapRef;
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var locLoadState = useState(false);
    var locLoading = locLoadState[0];
    var setLocLoading = locLoadState[1];
    var cityState = useState('');
    var city = cityState[0];
    var setCity = cityState[1];
    var locErrorState = useState(null);
    var locError = locErrorState[0];
    var setLocError = locErrorState[1];
    var nearbyBannerState = useState(null);
    var nearbyBanner = nearbyBannerState[0];
    var setNearbyBanner = nearbyBannerState[1];
    var bannerDismissedState = useState(false);
    var bannerDismissed = bannerDismissedState[0];
    var setBannerDismissed = bannerDismissedState[1];
    var beaconIdxState = useState(0);
    var beaconIdx = beaconIdxState[0];
    var setBeaconIdx = beaconIdxState[1];
    var userPosState = useState(null);
    var userPos = userPosState[0];
    var setUserPos = userPosState[1];

    // Cycle BLE beacon suggestions every 8 seconds when in-store mode is active
    useEffect(function() {
      if (!inStoreMode) return;
      var timer = setInterval(function() {
        setBeaconIdx(function(i) { return (i + 1) % BLE_BEACONS.length; });
      }, 8000);
      return function() { clearInterval(timer); };
    }, [inStoreMode]);

    // Check proximity to markers (300m radius) and show banner (persists per session)
    useEffect(function() {
      if (!userPos || markers.length === 0 || bannerDismissed) return;
      var nearby = markers.find(function(m) {
        return GREAT_CIRCLE_DIST(userPos.lat, userPos.lng, m.coordinate.latitude, m.coordinate.longitude) <= 300;
      });
      setNearbyBanner(nearby ? nearby.title : null);
    }, [userPos, markers, bannerDismissed]);

    var ECO_STORES = [
      { id: 's1', name: 'Bio & Beyond', type: 'Organic Market', rating: 4.8, offsetLat: 0.008, offsetLng: 0.012 },
      { id: 's2', name: 'Green Basket', type: 'Zero Waste Store', rating: 4.6, offsetLat: -0.005, offsetLng: 0.018 },
      { id: 's3', name: 'Earth Pantry', type: 'Eco Supermarket', rating: 4.7, offsetLat: 0.012, offsetLng: -0.007 },
      { id: 's4', name: 'Natura Foods', type: 'Health Food Store', rating: 4.5, offsetLat: -0.009, offsetLng: -0.014 },
      { id: 's5', name: 'Pure & Local', type: 'Farmers Market', rating: 4.9, offsetLat: 0.003, offsetLng: 0.021 }
    ];

    var handleLocate = useCallback(function() {
      setLocLoading(true);
      setLocError(null);
      getCurrentLocation().then(function(result) {
        if (result.error) {
          setLocError(result.error);
          setLocLoading(false);
          return;
        }
        var lat = result.latitude;
        var lng = result.longitude;
        setUserPos({ lat: lat, lng: lng });
        setBannerDismissed(false);
        var newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.04, longitudeDelta: 0.04 };
        setRegion(newRegion);
        animateToRegion(newRegion, 800);
        reverseGeocode(lat, lng).then(function(res) {
          if (res && res[0] && !res[0].error) { setCity(res[0].city || res[0].address || ''); }
        });
        clearMarkers();
        ECO_STORES.forEach(function(store) {
          addMarker({
            id: store.id,
            coordinate: { latitude: lat + store.offsetLat, longitude: lng + store.offsetLng },
            title: store.name,
            description: store.type + ' ★ ' + store.rating
          });
        });
        setLocLoading(false);
      });
    }, [getCurrentLocation, reverseGeocode, setRegion, animateToRegion, clearMarkers, addMarker]);

    var mapH = Dimensions.get('window').height - insets.top - HEADER_HEIGHT - (Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : TAB_MENU_HEIGHT + insets.bottom);

    return React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.background } },
      React.createElement(View, {
        style: {
          backgroundColor: theme.colors.primary, paddingTop: insets.top + 16,
          paddingBottom: 16, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
        }
      },
        React.createElement(View, null,
          React.createElement(Text, { style: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' } }, 'Eco Map'),
          city
            ? React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 } }, city)
            : React.createElement(Text, { style: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 } }, 'Find eco-friendly stores nearby')
        ),
        React.createElement(TouchableOpacity, {
          style: {
            backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12,
            padding: 10, flexDirection: 'row', alignItems: 'center'
          },
          onPress: handleLocate, disabled: locLoading, componentId: 'locate-btn'
        },
          locLoading
            ? React.createElement(ActivityIndicator, { color: '#FFFFFF', size: 'small', componentId: 'loc-loader' })
            : React.createElement(MaterialIcons, { name: 'my-location', size: 22, color: '#FFFFFF' })
        )
      ),
      locError
        ? React.createElement(View, {
            style: { backgroundColor: '#FEF2F2', padding: 12, marginHorizontal: 16, marginTop: 8, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: theme.colors.error }
          },
            React.createElement(Text, { style: { color: '#7F1D1D', fontSize: 13 } }, locError)
          )
        : null,
      // Proximity banner — shown when user is within 300m of an eco store
      nearbyBanner && !bannerDismissed
        ? React.createElement(View, {
            style: { backgroundColor: theme.colors.success, marginHorizontal: 16, marginTop: 8, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' }
          },
            React.createElement(MaterialIcons, { name: 'place', size: 20, color: '#FFFFFF' }),
            React.createElement(Text, { style: { flex: 1, color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginLeft: 8 } }, "You're near " + nearbyBanner + " — open in Maps?"),
            React.createElement(TouchableOpacity, { onPress: function() { setBannerDismissed(true); }, componentId: 'banner-dismiss-btn', style: { padding: 4 } },
              React.createElement(Text, { style: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' } }, 'Dismiss')
            )
          )
        : null,
      React.createElement(MapView, {
        ref: mapRef,
        provider: 'google',
        style: { height: mapH, width: '100%' },
        region: region,
        onRegionChangeComplete: setRegion,
        showsUserLocation: true
      },
        markers.map(function(m) {
          return React.createElement(Marker, {
            key: m.id,
            coordinate: m.coordinate,
            title: m.title,
            description: m.description
          },
            React.createElement(Callout, null,
              React.createElement(View, { style: { padding: 8, minWidth: 150 } },
                React.createElement(Text, { style: { fontWeight: 'bold', fontSize: 14, color: textPrimary } }, m.title),
                React.createElement(Text, { style: { fontSize: 12, color: textSecondary, marginTop: 2 } }, m.description)
              )
            )
          );
        })
      ),
      // BLE Aisle Recommendations card — simulates Bluetooth proximity events (no real BLE radio)
      inStoreMode
        ? React.createElement(View, {
            style: { backgroundColor: '#EDE9FE', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#7C3AED40' }
          },
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 } },
              React.createElement(MaterialIcons, { name: 'bluetooth-searching', size: 18, color: '#7C3AED' }),
              React.createElement(Text, { style: { fontSize: 14, fontWeight: '700', color: '#4C1D95', marginLeft: 6 } }, 'Aisle Recommendations'),
              React.createElement(View, { style: { marginLeft: 'auto', backgroundColor: '#7C3AED', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 } },
                React.createElement(Text, { style: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' } }, 'BLE LIVE')
              )
            ),
            React.createElement(View, { style: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12 } },
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'flex-start' } },
                React.createElement(View, { style: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7C3AED20', alignItems: 'center', justifyContent: 'center', marginRight: 12 } },
                  React.createElement(MaterialIcons, { name: 'sensors', size: 18, color: '#7C3AED' })
                ),
                React.createElement(View, { style: { flex: 1 } },
                  React.createElement(Text, { style: { fontSize: 12, color: '#7C3AED', fontWeight: '700', marginBottom: 2 } }, BLE_BEACONS[beaconIdx].aisle),
                  React.createElement(Text, { style: { fontSize: 13, color: '#4C1D95', lineHeight: 20 } }, BLE_BEACONS[beaconIdx].tip)
                )
              )
            )
          )
        : null,
      React.createElement(View, {
        style: {
          backgroundColor: theme.colors.card, marginHorizontal: 16, marginVertical: 12,
          borderRadius: 16, padding: 14, borderWidth: 1, borderColor: theme.colors.border
        }
      },
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
          React.createElement(MaterialIcons, { name: 'store', size: 18, color: theme.colors.primary }),
          React.createElement(Text, { style: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, marginLeft: 6 } }, 'Nearby Eco Stores'),
          React.createElement(View, {
            style: {
              marginLeft: 'auto', backgroundColor: theme.colors.primary + '20',
              paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10
            }
          },
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.primary, fontWeight: '600' } }, String(markers.length) + ' found')
          )
        ),
        markers.length === 0
          ? React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', paddingVertical: 8 } },
              'Tap the location button to find\neco-friendly stores near you'
            )
          : React.createElement(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: { flexGrow: 'initial' } },
              markers.map(function(m) {
                return React.createElement(View, {
                  key: m.id,
                  style: {
                    backgroundColor: theme.colors.background, borderRadius: 12, padding: 12,
                    marginRight: 10, minWidth: 140, borderWidth: 1, borderColor: theme.colors.border
                  }
                },
                  React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
                    React.createElement(MaterialIcons, { name: 'eco', size: 16, color: theme.colors.primary }),
                    React.createElement(Text, { style: { fontSize: 11, color: theme.colors.primary, fontWeight: '600', marginLeft: 4 } }, 'ECO STORE')
                  ),
                  React.createElement(Text, { style: { fontSize: 13, fontWeight: 'bold', color: theme.colors.textPrimary }, numberOfLines: 1 }, m.title),
                  React.createElement(Text, { style: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 } }, m.description)
                );
              })
            )
      )
    );
  };
  // @end:MapScreen

  // @section:SettingsScreen @depends:[ThemeContext,styles]
  var SettingsScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var darkMode = themeCtx.darkMode;
    var toggleDarkMode = themeCtx.toggleDarkMode;
    var inStoreMode = themeCtx.inStoreMode;
    var toggleInStoreMode = themeCtx.toggleInStoreMode;
    var showSecurityState = useState(false);
    var showSecurity = showSecurityState[0];
    var setShowSecurity = showSecurityState[1];
    var insets = useSafeAreaInsets();
    var scansQuery = useQuery('scans') || {};
    var scans = scansQuery.data || [];
    var refetchScans = scansQuery.refetch || function() {};
    var favsQuery = useQuery('favorites') || {};
    var favs = favsQuery.data || [];
    var refetchFavs = favsQuery.refetch || function() {};
    var deleteScanMutation = useMutation('scans', 'delete') || {};
    var deleteScan = deleteScanMutation.mutate || function() { return Promise.resolve(); };
    var deleteFavMutation = useMutation('favorites', 'delete') || {};
    var deleteFav = deleteFavMutation.mutate || function() { return Promise.resolve(); };
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var totalCO2 = useMemo(function() {
      return scans.reduce(function(s, sc) { return s + (parseFloat(sc.co2_kg) || 0); }, 0);
    }, [scans]);

    var handleClearHistory = useCallback(function() {
      var doIt = function() {
        var promises = scans.map(function(s) { return deleteScan({ id: s.id }); });
        Promise.all(promises).then(function() {
          refetchScans();
          Platform.OS === 'web' ? window.alert('History cleared!') : Alert.alert('Done', 'Scan history cleared.');
        }).catch(function(err) {
          Platform.OS === 'web' ? window.alert(err.message) : Alert.alert('Error', err.message);
        });
      };
      if (Platform.OS === 'web') {
        if (window.confirm('Clear all scan history? This cannot be undone.')) { doIt(); }
      } else {
        Alert.alert('Clear History', 'Clear all scan history? This cannot be undone.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: doIt }
        ]);
      }
    }, [scans, deleteScan, refetchScans]);

    var handleClearFavs = useCallback(function() {
      var doIt = function() {
        var promises = favs.map(function(f) { return deleteFav({ id: f.id }); });
        Promise.all(promises).then(function() {
          refetchFavs();
          Platform.OS === 'web' ? window.alert('Favorites cleared!') : Alert.alert('Done', 'Favorites cleared.');
        }).catch(function(err) {
          Platform.OS === 'web' ? window.alert(err.message) : Alert.alert('Error', err.message);
        });
      };
      if (Platform.OS === 'web') {
        if (window.confirm('Clear all favorites?')) { doIt(); }
      } else {
        Alert.alert('Clear Favorites', 'Remove all saved alternatives?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: doIt }
        ]);
      }
    }, [favs, deleteFav, refetchFavs]);

    var SECURITY_ITEMS = [
      { icon: 'lock', label: 'TLS 1.3', desc: 'All API traffic encrypted in transit' },
      { icon: 'verified-user', label: 'Certificate Pinning', desc: 'Prevents MITM attacks on mobile' },
      { icon: 'security', label: 'OAuth 2.0 + PKCE', desc: 'Industry-standard auth flow' },
      { icon: 'timer', label: 'JWT 15-min expiry', desc: 'Short-lived access tokens' },
      { icon: 'phone-android', label: 'MFA Support', desc: 'Multi-factor authentication ready' },
      { icon: 'enhanced-encryption', label: 'bcrypt passwords', desc: 'Salted password hashing' },
      { icon: 'shield', label: 'Cloudflare WAF', desc: 'Web application firewall & DDoS protection' },
      { icon: 'speed', label: 'Rate Limiting', desc: '100 req/min per IP, 1000/min per user' },
      { icon: 'public', label: 'Geo-filtering', desc: 'Block requests from restricted regions' },
      { icon: 'cloud', label: 'CDN + Autoscaling', desc: 'Global edge + elastic compute' },
      { icon: 'monitor-heart', label: 'Monitoring', desc: 'Real-time alerting on anomalies' }
    ];

    var renderSettingRow = function(icon, label, sublabel, right, onPress, componentId) {
      return React.createElement(TouchableOpacity, {
        style: {
          flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
          paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border
        },
        onPress: onPress, componentId: componentId
      },
        React.createElement(View, {
          style: {
            width: 38, height: 38, borderRadius: 10, backgroundColor: theme.colors.primary + '20',
            alignItems: 'center', justifyContent: 'center', marginRight: 14
          }
        },
          React.createElement(MaterialIcons, { name: icon, size: 20, color: theme.colors.primary })
        ),
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: { fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary } }, label),
          sublabel ? React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 } }, sublabel) : null
        ),
        right || React.createElement(MaterialIcons, { name: 'chevron-right', size: 20, color: theme.colors.textSecondary })
      );
    };

    return React.createElement(View, { style: { flex: 1 } },
      React.createElement(Modal, { visible: showSecurity, animationType: 'slide', transparent: true, onRequestClose: function() { setShowSecurity(false); } },
        React.createElement(View, { style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' } },
          React.createElement(View, { style: { flex: 1, backgroundColor: theme.colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: insets.bottom + 20, maxHeight: '85%' } },
            React.createElement(View, { style: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 } },
              React.createElement(View, { style: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border } })
            ),
            React.createElement(View, { style: { paddingHorizontal: 24, paddingBottom: 16 } },
              React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
                React.createElement(MaterialIcons, { name: 'security', size: 24, color: theme.colors.primary }),
                React.createElement(Text, { style: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginLeft: 8 } }, 'Security Measures')
              ),
              React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 } }, 'Production-grade protections planned for v1.0')
            ),
            React.createElement(ScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: { paddingHorizontal: 24, paddingBottom: 16 } },
              SECURITY_ITEMS.map(function(item) {
                return React.createElement(View, {
                  key: item.label,
                  style: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }
                },
                  React.createElement(View, { style: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
                    React.createElement(MaterialIcons, { name: item.icon, size: 18, color: theme.colors.primary })
                  ),
                  React.createElement(View, { style: { flex: 1 } },
                    React.createElement(Text, { style: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary } }, item.label),
                    React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 } }, item.desc)
                  )
                );
              })
            ),
            React.createElement(TouchableOpacity, { style: { padding: 16, alignItems: 'center' }, onPress: function() { setShowSecurity(false); }, componentId: 'close-security-btn' },
              React.createElement(Text, { style: { color: theme.colors.textSecondary, fontSize: 15 } }, 'Close')
            )
          )
        )
      ),
      React.createElement(ScrollView, {
        style: { flex: 1, backgroundColor: theme.colors.background },
        contentContainerStyle: { paddingBottom: scrollBottomPadding }
      },
        React.createElement(View, {
          style: {
            backgroundColor: theme.colors.primary, paddingTop: insets.top + 16,
            paddingBottom: 20, paddingHorizontal: 24
          }
        },
          React.createElement(Text, { style: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' } }, 'Settings')
        ),
      React.createElement(View, {
        style: {
          marginHorizontal: 20, marginTop: -20, backgroundColor: theme.colors.card, borderRadius: 20,
          padding: 16, marginBottom: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
          borderWidth: 1, borderColor: theme.colors.border
        }
      },
        React.createElement(Text, { style: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' } }, 'Your Impact'),
        React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-around' } },
          React.createElement(View, { style: { alignItems: 'center' } },
            React.createElement(Text, { style: { fontSize: 26, fontWeight: 'bold', color: theme.colors.primary } }, String(scans.length)),
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, 'Scans')
          ),
          React.createElement(View, { style: { width: 1, backgroundColor: theme.colors.border } }),
          React.createElement(View, { style: { alignItems: 'center' } },
            React.createElement(Text, { style: { fontSize: 26, fontWeight: 'bold', color: totalCO2 >= 0 ? theme.colors.success : theme.colors.error } },
              (totalCO2 >= 0 ? '+' : '') + formatCO2(totalCO2)
            ),
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, 'kg CO₂')
          ),
          React.createElement(View, { style: { width: 1, backgroundColor: theme.colors.border } }),
          React.createElement(View, { style: { alignItems: 'center' } },
            React.createElement(Text, { style: { fontSize: 26, fontWeight: 'bold', color: ECO_SCORE_COLORS['b'] } }, String(favs.length)),
            React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } }, 'Saved Alts')
          )
        )
      ),
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 16 } },
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' } }, 'Appearance'),
        React.createElement(View, {
          style: {
            backgroundColor: theme.colors.card, borderRadius: 16, overflow: 'hidden',
            borderWidth: 1, borderColor: theme.colors.border
          }
        },
          renderSettingRow(
            'brightness-6', 'Dark Mode', 'Switch to dark theme',
            React.createElement(RN.Switch, {
              value: darkMode, onValueChange: toggleDarkMode,
              trackColor: { false: theme.colors.border, true: theme.colors.primary },
              thumbColor: '#FFFFFF', componentId: 'dark-mode-switch'
            }),
            null, 'dark-mode-row'
          ),
          renderSettingRow(
            'bluetooth-searching', 'In-Store Mode', 'Show aisle BLE recommendations on Map',
            React.createElement(RN.Switch, {
              value: inStoreMode, onValueChange: toggleInStoreMode,
              trackColor: { false: theme.colors.border, true: '#7C3AED' },
              thumbColor: '#FFFFFF', componentId: 'in-store-mode-switch'
            }),
            null, 'in-store-mode-row'
          )
        )
      ),
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 16 } },
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' } }, 'Eco Score Guide'),
        React.createElement(View, {
          style: {
            backgroundColor: theme.colors.card, borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: theme.colors.border
          }
        },
          ['a', 'b', 'c', 'd', 'e'].map(function(g) {
            return React.createElement(View, {
              key: g,
              style: { flexDirection: 'row', alignItems: 'center', marginBottom: g !== 'e' ? 10 : 0 }
            },
              renderEcoBadge(g, 'sm'),
              React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
                React.createElement(Text, { style: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary } },
                  'Grade ' + g.toUpperCase() + ' — ' + (ECO_SCORE_LABELS[g] || '')
                ),
                React.createElement(Text, { style: { fontSize: 12, color: theme.colors.textSecondary } },
                  CO2_BY_GRADE[g] >= 0
                    ? '+' + formatCO2(CO2_BY_GRADE[g]) + ' kg CO₂ better than average'
                    : formatCO2(Math.abs(CO2_BY_GRADE[g])) + ' kg CO₂ worse than average'
                )
              )
            );
          })
        )
      ),
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 16 } },
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' } }, 'Data Management'),
        React.createElement(View, {
          style: {
            backgroundColor: theme.colors.card, borderRadius: 16, overflow: 'hidden',
            borderWidth: 1, borderColor: theme.colors.border
          }
        },
          renderSettingRow('history', 'Clear Scan History', String(scans.length) + ' scans stored', null, handleClearHistory, 'clear-history-btn'),
          renderSettingRow('favorite-border', 'Clear Saved Alternatives', String(favs.length) + ' alternatives saved', null, handleClearFavs, 'clear-favs-btn')
        )
      ),
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 16 } },
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' } }, 'Security'),
        React.createElement(View, { style: { backgroundColor: theme.colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border } },
          renderSettingRow('security', 'About Security', 'View production security measures', null, function() { setShowSecurity(true); }, 'security-info-btn')
        )
      ),
      React.createElement(View, { style: { marginHorizontal: 20, marginBottom: 16 } },
        React.createElement(Text, { style: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' } }, 'About'),
        React.createElement(View, {
          style: {
            backgroundColor: theme.colors.card, borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center'
          }
        },
          React.createElement(View, {
            style: {
              width: 56, height: 56, borderRadius: 16, backgroundColor: theme.colors.primary,
              alignItems: 'center', justifyContent: 'center', marginBottom: 10,
              shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
            }
          },
            React.createElement(MaterialIcons, { name: 'eco', size: 32, color: '#FFFFFF' })
          ),
          React.createElement(Text, { style: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary } }, 'EcoSnap'),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 } }, 'Version 1.0.0'),
          React.createElement(Text, { style: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 20 } },
            'Powered by Open Food Facts — a free, open, collaborative database of food products from around the world.'
          )
        )
      )
    )
  );
  };
  // @end:SettingsScreen

  // @section:TabNavigator @depends:[HomeScreen,ScanScreen,HistoryScreen,ImpactScreen,MapScreen,SettingsScreen,navigation-setup]
  var TabNavigator = function() {
    var insets = useSafeAreaInsets();
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    return React.createElement(View, { style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' } },
      React.createElement(Tab.Navigator, {
        screenOptions: {
          headerShown: false,
          tabBarStyle: {
            position: 'absolute', bottom: 0,
            height: Platform.OS === 'web' ? TAB_MENU_HEIGHT : TAB_MENU_HEIGHT + insets.bottom,
            borderTopWidth: 0, backgroundColor: theme.colors.card,
            shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 12
          },
          tabBarItemStyle: { padding: 0 },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary
        }
      },
        React.createElement(Tab.Screen, {
          name: 'Home',
          component: HomeScreen,
          options: {
            tabBarLabel: 'Home',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'home', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Scan',
          component: ScanScreen,
          options: {
            tabBarLabel: 'Scan',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'qr-code-scanner', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'History',
          component: HistoryScreen,
          options: {
            tabBarLabel: 'History',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'history', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Impact',
          component: ImpactScreen,
          options: {
            tabBarLabel: 'Impact',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'insights', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Map',
          component: MapScreen,
          options: {
            tabBarLabel: 'Eco Map',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'map', size: 24, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, {
          name: 'Settings',
          component: SettingsScreen,
          options: {
            tabBarLabel: 'Settings',
            tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'settings', size: 24, color: p.color }); }
          }
        })
      )
    );
  };
  // @end:TabNavigator

  // @section:MainNavigator @depends:[TabNavigator,navigation-setup]
  var MainNavigator = function() {
    return React.createElement(Stack.Navigator, {
      screenOptions: { headerShown: false },
      initialRouteName: 'MainApp'
    },
      React.createElement(Stack.Screen, { name: 'MainApp', component: TabNavigator })
    );
  };
  // @end:MainNavigator

  // @section:styles @depends:[theme]
  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    card: {
      backgroundColor: cardColor,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3
    },
    fab: {
      position: 'absolute',
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6
    }
  });
  // @end:styles

  // @section:return @depends:[ThemeProvider,MainNavigator]
  return React.createElement(ThemeProvider, null,
    React.createElement(View, { style: { flex: 1, width: '100%', height: '100%' } },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(MainNavigator)
    )
  );
  // @end:return
};