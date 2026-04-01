import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('minnesota', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="minnesota" language="vietnamese" /> }