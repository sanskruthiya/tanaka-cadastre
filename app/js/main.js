const map = L.map('map', {
    zoomControl: false,
    zoomSnap: 0.5,
    minZoom: 14,
    maxZoom: 21,
    condensedAttributionControl: false
}).setView([35.9126, 139.9577],16);

L.control.condensedAttribution({
    emblem: '&copy;',
    prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet-Слава Україні!</a> | <a href="https://front.geospatial.jp/">登記所備付地図データ柏市(法務省)</a>'
}).addTo(map);

const bounds = [[35.9850, 139.8000], [35.7000, 140.1500]];
map.setMaxBounds(bounds);

const basemap_osm = L.tileLayer('https://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',maxZoom: 21});
const basemap_gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>', maxNativeZoom:18, maxZoom: 21, errorTileUrl:'app/css/images/noimage.png'});

function onClickFeature01(e) {
    const layer = e.target;
    area_layer01.resetStyle();
    layer.setStyle({weight: 2, fillColor: '#fff', fillOpacity: 0.5 });
    layer.bringToFront();
}

function onClickFeature02(e) {
    const layer = e.target;
    area_layer02.resetStyle();
    layer.setStyle({weight: 2, fillColor: '#555', fillOpacity: 0.5}); 
    layer.bringToFront();
}

function onEachFeature_cadastral01(feature, layer){
    let popupContent;
    popupContent =
        '<table class="tablestyle02">'+
        '<tr><td>地番名</td><td>'+(feature.properties.name)+'</td></tr>'+
        '<tr><td>推定面積<p class="remarks"></p></td><td>'+(feature.properties.area)+' m2</td></tr>'+
        '</table><p class="remarks">地番名は住所とは異なります。<br>面積は独自計算した推定値です。</p>';
    const popupStyle = L.popup({autoPan:true}).setContent(popupContent);
    layer.bindPopup(popupStyle);
    layer.on({click: onClickFeature01});
}

function onEachFeature_cadastral02(feature, layer){
    let popupContent;
    popupContent =
        '<table class="tablestyle02">'+
        '<tr><td>地点名</td><td>'+(feature.properties.name)+'</td></tr>'+
        '<tr><td>推定面積<p class="remarks"></p></td><td>'+(feature.properties.area)+' m2</td></tr>'+
        '</table><p class="remarks">地点名は住所とは異なります。<br>面積は独自計算した推定値です。</p>';
    const popupStyle = L.popup({autoPan:true}).setContent(popupContent);
    layer.bindPopup(popupStyle);
    layer.on({click: onClickFeature02});
}

const area_layer01 = new L.geoJson(cadastral_data, {
    style: {"fillColor":"transparent", "color":"#fff", "weight":1, "opacity": 0.7},
    onEachFeature: onEachFeature_cadastral01
});

const area_layer02 = new L.geoJson(cadastral_data, {
    style: {"fillColor":"transparent", "color":"#ff7800", "weight":1, "opacity": 0.7},
    onEachFeature: onEachFeature_cadastral02
});

const group_gsi = L.layerGroup([basemap_gsi, area_layer01])
const group_osm = L.layerGroup([basemap_osm, area_layer02])

group_gsi.addTo(map);

map.on('baselayerchange', function () {
    area_layer01.resetStyle();
    area_layer02.resetStyle();
});

const info = L.control({position:'bottomleft'});
info.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info');
    this._div.innerHTML = '<p class="info-title">柏たなか土地登記マップ</p><p class="comments"><a href="https://www.moj.go.jp/MINJI/minji05_00494.html" target="_blank">2023年1月の法務省公開データ</a>に基づき加工</p>'
    return this._div;
}
info.addTo(map);

const overlayMaps = {};
const baseMaps = {
    '<i class="far fa-image" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:#555"></i>空撮画像': group_gsi,
    '<i class="fas fa-map-marked-alt" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:#555"></i>地図': group_osm
};

const slidemenutitle = '<h3 align="center">柏たなか土地登記マップ</h3><p align="center">（2023年1月）</p><hr class="style01">';
let contents = '<p align="left"><ul><li><a href="https://www.moj.go.jp/MINJI/minji05_00494.html" target="_blank">法務省法務局が提供</a>し、<a href="https://front.geospatial.jp/" target="_blank">G空間情報センター</a>で公開している<span class="style01">登記所備付地図データ</span>に基づき、<span class="style01">千葉県柏市の柏たなかエリアの土地登記の区画などを示すマップ</span>です。</li>'
contents += '<li>このウェブページは上記の出典元の情報に基づき、当サイト管理者が独自に加工・作成したものです。土地区画と地名は出典元のXMLファイルについて<a href="https://www.digital.go.jp/news/4b7250a3-3fcf-4b83-8d52-4bb131e1ba9d/" target="_blank">こちら</a>を利用して変換したものですが、<span class="style01">面積については当サイト管理者が別途計算した推定値</span>となります。</li>'
contents += '<li>下図には <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a> と <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a>を利用しています。</li>'
contents += '<li>柏市内に滞在中であれば、スマートフォンなどお使いの機器の位置情報取得を許可し、<i class="fas fa-map-marker-alt" style="color:#555"></i>　ボタンを押すことで、現在位置を表示することができます。</li>'
contents += '<li>なお、<span class="style01">本ウェブサイトがご利用者様の位置情報等を含め個人情報を記録することは一切ございません</span>のでご安心ください。</li>'
contents += '<li>お問い合わせは当サイト管理者へご連絡ください。（ <a href="https://twitter.com/smille_feuille" target="_blank">Twitter</a> | <a href="https://github.com/sanskruthiya/tanaka-cadastre" target="_blank">Github</a> ）</li></ul></p>';

L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);

L.control.slideMenu(slidemenutitle + contents, {width:'280px', icon:'fas fa-info'}).addTo(map);
L.control.polylineMeasure({position:'topleft', imperial:false, showClearControl:true, measureControlLabel:'m'}).addTo(map);
L.control.locate({position:'topleft', icon:'fas fa-map-marker-alt', keepCurrentZoomLevel:true, showPopup:false, drawCircle:false}).addTo(map);
L.control.scale({maxWidth:150, metric:true, imperial:false, position: 'bottomleft'}).addTo(map);
