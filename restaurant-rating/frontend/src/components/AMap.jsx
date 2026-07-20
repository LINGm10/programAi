import React, { useEffect, useRef } from 'react';

const AMap = ({ markers = [], center, zoom = 12, style = { height: 400, width: '100%' } }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.AMap) return;

    mapInstance.current = new window.AMap.Map(mapRef.current, {
      zoom,
      center: center ? [center.longitude, center.latitude] : undefined,
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.clearMap();

    markers.forEach((marker) => {
      if (marker.latitude && marker.longitude) {
        const m = new window.AMap.Marker({
          position: [marker.longitude, marker.latitude],
          title: marker.name,
        });
        m.setMap(mapInstance.current);

        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="padding:8px"><strong>${marker.name}</strong><br/>${marker.address || ''}</div>`,
        });

        m.on('click', () => {
          infoWindow.open(mapInstance.current, m.getPosition());
        });
      }
    });

    if (markers.length > 0 && markers[0].latitude) {
      mapInstance.current.setCenter([markers[0].longitude, markers[0].latitude]);
    }
  }, [markers]);

  return <div ref={mapRef} style={style} />;
};

export default AMap;
