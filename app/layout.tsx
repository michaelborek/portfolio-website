import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Michal Borek',
  description:
    'Michal Borek is a machine learning researcher at Michigan State University working on deep learning for chest X-ray screening with CDC/NIOSH.',
  openGraph: {
    title: 'Michal Borek',
    description: 'Machine learning researcher at Michigan State University. Medical imaging, foundation models, and research software.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
