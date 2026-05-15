import ClientOnly from './components/ClientOnly';
import NycApp from './components/nyc/shell';

export default function Home() {
  return (
    <ClientOnly>
      <NycApp />
    </ClientOnly>
  );
}
