import React, { useEffect, useRef } from 'react';

const AMap = ({ markers = [], center, zoom = 15, style = { height: 400, width: '100%' } }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.AMap) return;

    mapInstance.current = new window.AMap.Map(mapRef.current, {
      zoom,
      center: center ? [center.longitude, center.latitude] : [116.397428, 39.90923],
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  // 更新中心点
  useEffect(() => {
    if (!mapInstance.current || !center) return;
    mapInstance.current.setCenter([center.longitude, center.latitude]);
    mapInstance.current.setZoom(zoom);
  }, [center]);

  // 更新标记
  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.clearMap();

    // 添加定位中心标记（红色）
    if (center) {
      const centerMarker = new window.AMap.Marker({
        position: [center.longitude, center.latitude],
        title: '定位位置',
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(25, 34),
          image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        }),
      });
      centerMarker.setMap(mapInstance.current);
    }

    // 添加餐厅标记（蓝色）
    markers.forEach((marker) => {
      if (marker.latitude && marker.longitude) {
        const m = new window.AMap.Marker({
          position: [marker.longitude, marker.latitude],
          title: marker.name,
        });
        m.setMap(mapInstance.current);

        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="padding:8px;min-width:200px"><strong>${marker.name}</strong><br/><span style="color:#666;font-size:12px">${marker.address || ''}</span>${marker.distance ? `<br/><span style="color:#1890ff">距离：${marker.distance}米</span>` : ''}</div>`,
        });

        m.on('click', () => {
          infoWindow.open(mapInstance.current, m.getPosition());
        });
      }
    });

    // 如果有标记，调整视野
    if (markers.length > 0 && markers[0].latitude) {
      const bounds = new window.AMap.Bounds();
      if (center) {
        bounds.extend([center.longitude, center.latitude]);
      }
      markers.forEach((m) => {
        if (m.latitude && m.longitude) {
          bounds.extend([m.longitude, m.latitude]);
        }
      });
      mapInstance.current.setBounds(bounds);
    }
  }, [markers, center]);

  return <div ref={mapRef} style={style} />;
};

export default AMap;
