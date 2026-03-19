'use client'

import Image from 'next/image'
import { formatTimestamp } from '@/lib/chat-types'
import type { ActivityMessage as ActivityMessageType } from '@/lib/chat-activities'
import { PollComponent } from './poll-component'
import { QuizComponent } from './quiz-component'
import { NoteCard } from './note-card'

export function ActivityMessageRow({ item }: { item: ActivityMessageType }) {
  const { activity, authorName, authorAvatar, timestamp } = item

  return (
    <div className="px-5 py-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image
            src={authorAvatar || '/placeholder.svg'}
            alt={authorName}
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-sm font-semibold text-zinc-200">{authorName}</span>
          <span className="ml-2 text-xs text-zinc-500">{formatTimestamp(new Date(timestamp))}</span>
        </div>
      </div>
      {activity.type === 'poll' && <PollComponent poll={activity} />}
      {activity.type === 'quiz' && <QuizComponent quiz={activity} />}
      {activity.type === 'note' && <NoteCard note={activity} />}
    </div>
  )
}
