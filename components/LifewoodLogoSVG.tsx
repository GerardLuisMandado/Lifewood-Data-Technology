// This is the Lifewood logo SVG as a React component
export default function LifewoodLogoSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="220" height="70" viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="220" height="70" fill="#F5EFDD"/>
      <polygon points="36,15 36,55 66,70 96,55 96,15 66,0" fill="#FDBB45"/>
      <text x="110" y="50" fontFamily="Montserrat, Arial, sans-serif" fontWeight="bold" fontSize="56" fill="#0D4A30" textAnchor="middle">lifewood</text>
    </svg>
  );
}
