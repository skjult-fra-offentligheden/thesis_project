export interface Vessel {
  id: string;
  name: string;
  imoNumber: string;
  type: string;
}

export interface Fleet {
  id: string;
  name: string;
  vessels: Vessel[];
}

export const fleets: Fleet[] = [
  {
    id: 'fleet-atlantic',
    name: 'Fleet Atlantic',
    vessels: [
      { id: 'v-atl-1', name: 'MV Atlantic Pioneer', imoNumber: '9234567', type: 'Bulk Carrier' },
      { id: 'v-atl-2', name: 'MV Atlantic Star',    imoNumber: '9234568', type: 'Container Ship' },
      { id: 'v-atl-3', name: 'MV Atlantic Wave',    imoNumber: '9234569', type: 'Tanker' },
    ],
  },
  {
    id: 'fleet-baltic',
    name: 'Fleet Baltic',
    vessels: [
      { id: 'v-bal-1', name: 'MV Baltic Aurora', imoNumber: '9345678', type: 'Ro-Ro' },
      { id: 'v-bal-2', name: 'MV Baltic Wind',   imoNumber: '9345679', type: 'Bulk Carrier' },
    ],
  },
  {
    id: 'fleet-pacific',
    name: 'Fleet Pacific',
    vessels: [
      { id: 'v-pac-1', name: 'MV Pacific Horizon',  imoNumber: '9456789', type: 'Container Ship' },
      { id: 'v-pac-2', name: 'MV Pacific Trader',   imoNumber: '9456790', type: 'Tanker' },
      { id: 'v-pac-3', name: 'MV Pacific Explorer', imoNumber: '9456791', type: 'Bulk Carrier' },
    ],
  },
];
