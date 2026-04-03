import React, { useState } from 'react'
import StoreDetail from './StoreDetail';
import StoreLocation from './StoreLocation';
import { Branch, branches } from '@/data/branches';

const StoreLocatorPage = () => {
    const [target, setTarget] = useState<[number, number] | null>(null);
    // Default to the first branch for now since the UI only shows one detail view
    const currentBranch = branches[0];

    const handleDirectionClick = () => {
        setTarget([currentBranch.coordinates.lat, currentBranch.coordinates.lng]);
    };

    return (
        <div className='flex flex-col md:flex-row h-full w-full'>
            <div className='w-full md:w-1/3 p-4 bg-black'>
                <StoreDetail branch={currentBranch} onDirectionClick={handleDirectionClick}/>
            </div>
            <div className='w-full md:w-2/3 h-[500px]'>
                <StoreLocation target={target || undefined} branches={[]} onSelectBranch={function (branch: Branch): void {
                    throw new Error('Function not implemented.');
                } } />
            </div>
        </div>
    )
}

export default StoreLocatorPage