import ClientOnly from './components/ClientOnly';
import Terminal from './components/terminal/Terminal';

export default function Home() {
  return (
    <ClientOnly>
      <Terminal />
    </ClientOnly>
  );
}
