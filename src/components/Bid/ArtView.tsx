import React from 'react';

type ArtViewProps = { mediaId: number };

export function ArtView({ mediaId }: ArtViewProps) {
  return <div className='art-view'>{mediaId}</div>;
}
