// utils/icons.js
import {
  EnvelopeIcon,
  PhoneIcon as HeroPhoneIcon,
  MapPinIcon as HeroMapPinIcon,
  SunIcon as HeroSunIcon,
  MoonIcon as HeroMoonIcon,
  QuestionMarkCircleIcon,
  UserIcon as HeroUserIcon,
  CogIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CurrencyRupeeIcon as HeroCurrencyRupeeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ShareIcon as HeroShareIcon,
  ReceiptRefundIcon,
  CheckCircleIcon as HeroCheckCircleIcon,
  CalendarIcon as HeroCalendarIcon,
  ClockIcon as HeroClockIcon,
  HomeIcon as HeroHomeIcon,
  UsersIcon as HeroUsersIcon,
  AcademicCapIcon as HeroAcademicCapIcon,
  ChartBarIcon as HeroChartBarIcon,
  BellIcon as HeroBellIcon,
  ChevronDownIcon as HeroChevronDownIcon,
  MenuIcon as HeroMenuIcon,
  XIcon as HeroXIcon,
  SearchIcon as HeroSearchIcon,
  LogoutIcon as HeroLogoutIcon,
  DocumentTextIcon as HeroDocumentTextIcon,
  TrendingUpIcon as HeroTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Export with the names we use in components
export const MailIcon = EnvelopeIcon;
export const PhoneIcon = HeroPhoneIcon;
export const MapPinIcon = HeroMapPinIcon;
export const SunIcon = HeroSunIcon;
export const MoonIcon = HeroMoonIcon;
export const HelpIcon = QuestionMarkCircleIcon;
export const UserIcon = HeroUserIcon;
export const SettingsIcon = CogIcon;
export const AlertIcon = ExclamationTriangleIcon;
export const InfoIcon = InformationCircleIcon;
export const MoneyIcon = HeroCurrencyRupeeIcon;
export const PrintIcon = PrinterIcon;
export const DownloadIcon = ArrowDownTrayIcon;
export const ShareIcon = HeroShareIcon;
export const ReceiptIcon = ReceiptRefundIcon;
export const CheckCircleIcon = HeroCheckCircleIcon;
export const CalendarIcon = HeroCalendarIcon;
export const ClockIcon = HeroClockIcon;
export const HomeIcon = HeroHomeIcon;
export const UsersIcon = HeroUsersIcon;
export const AcademicCapIcon = HeroAcademicCapIcon;
export const ChartBarIcon = HeroChartBarIcon;
export const BellIcon = HeroBellIcon;
export const ChevronDownIcon = HeroChevronDownIcon;
export const MenuIcon = HeroMenuIcon;
export const XIcon = HeroXIcon;
export const SearchIcon = HeroSearchIcon;
export const LogoutIcon = HeroLogoutIcon;
export const DocumentTextIcon = HeroDocumentTextIcon;
export const TrendingUpIcon = HeroTrendingUpIcon;

// Social media icons (custom)
export const FacebookIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const TwitterIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

export const LinkedInIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const InstagramIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const GitHubIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
// Custom icons as React components

export const HomeIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const UsersIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.181-.288-.5-.5-.854-.5h-1.146a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h1.146c.354 0 .673-.212.854-.5l1-1.5a.5.5 0 000-.5l-1-1.5z" />
  </svg>
);
export { TrendingUpIcon as HeroTrendingUpIcon } from '@heroicons/react/24/outline';
export { MenuIcon as HeroMenuIcon } from '@heroicons/react/24/outline';
export { XIcon as HeroXIcon } from '@heroicons/react/24/outline';
export { MagnifyingGlassIcon as HeroSearchIcon } from '@heroicons/react/24/outline';
export { ArrowLeftOnRectangleIcon as HeroLogoutIcon } from '@heroicons/react/24/outline';
 return (
   <AuthContext.Provider value={value}>
     {children}
   </AuthContext.Provider>
 );
 // ... (all your icon definitions)
// Make sure this is the end of the file - NO return statement after export
export const ClockIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
// End of file - no extra code after this
// ... (include all the other custom icons we defined earlier, but without the Heroicons re-exports)

// Remove the following lines if they exist:
// export { TrendingUpIcon as HeroTrendingUpIcon } from '@heroicons/react/24/outline';
// export { MenuIcon as HeroMenuIcon } from '@heroicons/react/24/outline';
// export { XIcon as HeroXIcon } from '@heroicons/react/24/outline';
// export { MagnifyingGlassIcon as HeroSearchIcon } from '@heroicons/react/24/outline';
// export { ArrowLeftOnRectangleIcon as HeroLogoutIcon } from '@heroicons/react/24/outline';

// Also, remove the return statement that was accidentally included.

// Make sure the file ends with the last icon export and no extra code.