// @ts-nocheck
'use client'

import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {

    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
    const router = useRouter();
    const [recordings, SetRecordings] = useState<CallRecording[]>([]);

    if(isLoading) return <Loader/>

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'recordings':
                return recordings;
            case 'upcoming':
                return upcomingCalls;
            default:
                return [];
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'recordings':
                return 'No Recordings';
            case 'upcoming':
                return 'No Upcoming Calls';
            default:
                return '';
        }
    }
    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                key={(meeting as Call).id} 
                icon={
                    type === 'ended' ? '/icons/previous.svg': type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recordings.svg'
                }
                title={(meeting as Call).state.custom.description.substring(0,26) || 'No decription'}
                date={meeting.state.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                isPreviousMeeting={type === 'ended'}
                buttonIcon1={type === 'recordings' ? 'icons/play.svg' : undefined}
                buttonText={type === 'recordings' ? 'Play' : 'Start'}
                link={type ==='recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                handleClick={type ==='recordings' ?  () => router.push(`${meeting.url}`) : ()=>router.push(`/meeting/${meeting.id}`)}
                />
            )) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>

    )
}

export default CallList
