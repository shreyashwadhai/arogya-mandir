import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Facility {
  id: string;
  name: string;
  location: string;
  code: string;
  district: string;
  cmoContact: string;
  ratingAverage: number;
}

export interface FacilityState {
  selectedFacility: Facility;
  availableFacilities: Facility[];
  isFacilityModalOpen: boolean;
}

const defaultFacilities: Facility[] = [
  {
    id: 'fac-402',
    name: 'District Hospital, Central Delhi',
    location: 'Campus Sector-4, New Delhi',
    code: 'AM-DEL-0402',
    district: 'Central Delhi',
    cmoContact: 'cmo.centraldelhi@delhi.gov.in',
    ratingAverage: 4.8
  },
  {
    id: 'fac-108',
    name: 'Arogya Mandir Health Centre, Rohini',
    location: 'Sector 15, Rohini, North West Delhi',
    code: 'AM-DEL-0108',
    district: 'North West Delhi',
    cmoContact: 'cmo.northwest@delhi.gov.in',
    ratingAverage: 4.6
  },
  {
    id: 'fac-505',
    name: 'Super Specialty Hospital, Safdarjung Enclave',
    location: 'Ring Road, Near AIIMS Metro, New Delhi',
    code: 'AM-DEL-0505',
    district: 'South Delhi',
    cmoContact: 'cmo.southdelhi@delhi.gov.in',
    ratingAverage: 4.9
  },
  {
    id: 'fac-204',
    name: 'Guru Teg Bahadur Hospital, Shahdara',
    location: 'Dilshad Garden, Shahdara, East Delhi',
    code: 'AM-DEL-0204',
    district: 'East Delhi',
    cmoContact: 'cmo.eastdelhi@delhi.gov.in',
    ratingAverage: 4.5
  }
];

const initialState: FacilityState = {
  selectedFacility: defaultFacilities[0],
  availableFacilities: defaultFacilities,
  isFacilityModalOpen: false,
};

export const facilitySlice = createSlice({
  name: 'facility',
  initialState,
  reducers: {
    selectFacility: (state, action: PayloadAction<Facility>) => {
      state.selectedFacility = action.payload;
    },
    toggleFacilityModal: (state) => {
      state.isFacilityModalOpen = !state.isFacilityModalOpen;
    },
    setFacilityModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFacilityModalOpen = action.payload;
    }
  },
});

export const { selectFacility, toggleFacilityModal, setFacilityModalOpen } = facilitySlice.actions;

export default facilitySlice.reducer;
