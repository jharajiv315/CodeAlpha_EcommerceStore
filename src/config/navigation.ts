import { ProductCategory } from '../types';

export interface CategoryLink {
  label: string;
  category: ProductCategory;
  description?: string;
  popular?: boolean;
}

export interface DepartmentGroup {
  name: string;
  description: string;
  categories: CategoryLink[];
}

export const DEPARTMENTS: DepartmentGroup[] = [
  {
    name: 'Computing & Displays',
    description: 'Workstations, ultrabooks, gaming laptops and pro displays',
    categories: [
      { label: 'Laptops', category: 'Laptops', popular: true },
      { label: 'TVs & Monitors', category: 'TVs & Monitors', popular: true },
      { label: 'PC Components', category: 'PC Components' },
    ],
  },
  {
    name: 'Mobile & Wearables',
    description: 'Flagship 5G smartphones, tablets and health trackers',
    categories: [
      { label: 'Smartphones', category: 'Smartphones', popular: true },
      { label: 'Tablets', category: 'Tablets' },
      { label: 'Smartwatches & Wearables', category: 'Smartwatches & Wearables', popular: true },
    ],
  },
  {
    name: 'Audio & Visual',
    description: 'Active noise-cancelling headphones, soundbars and cameras',
    categories: [
      { label: 'Headphones & Audio', category: 'Headphones & Audio', popular: true },
      { label: 'Cameras', category: 'Cameras' },
    ],
  },
  {
    name: 'Gaming & Smart Living',
    description: 'Consoles, high-refresh gear and home automation',
    categories: [
      { label: 'Gaming', category: 'Gaming', popular: true },
      { label: 'Networking & Smart Home', category: 'Networking & Smart Home' },
      { label: 'Accessories & Power', category: 'Accessories' },
    ],
  },
];

export const TOP_BRANDS = [
  { name: 'Apple', count: 11 },
  { name: 'Samsung', count: 9 },
  { name: 'Sony', count: 8 },
  { name: 'ASUS', count: 6 },
  { name: 'Dell', count: 5 },
  { name: 'HP', count: 5 },
  { name: 'Lenovo', count: 5 },
  { name: 'NVIDIA', count: 3 },
  { name: 'Bose', count: 3 },
  { name: 'LG', count: 4 },
  { name: 'Canon', count: 3 },
  { name: 'OnePlus', count: 3 },
];

export const QUICK_PROMOTIONS = [
  {
    title: 'New Arrivals 2026',
    subtitle: 'The latest Apple M3, Galaxy S25 & RTX 40-series',
    actionRoute: 'shop',
    badge: 'Just In',
  },
  {
    title: 'Top Electronics Deals',
    subtitle: 'Save up to 34% on Sony, Bose & ASUS laptops',
    actionRoute: 'deals',
    badge: 'Limited Offers',
  },
];
