import React from 'react';
import { Rate } from 'antd';

const StarRating = ({ value, count = 5, allowHalf = true, disabled = true, size = 'default' }) => {
  return <Rate value={parseFloat(value)} count={count} allowHalf={allowHalf} disabled={disabled} size={size} />;
};

export default StarRating;
