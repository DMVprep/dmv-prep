import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('arizona', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="arizona" language="haitian-creole" /> }
