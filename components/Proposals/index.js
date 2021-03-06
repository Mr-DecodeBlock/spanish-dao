import { Proposal } from "components/Proposal"
import { Select } from "components/Select"
import { useProposals } from "hooks/useProposals"
import { useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { filer } from "utils/filter"

const proposalOptions = [
    { label: "All", value: 'all' },
    { label: "Active", value: 1 },
    { label: "Defeated", value: 3 },
    { label: 'Succeeded', value: 4 },
    { label: 'Executed', value: 7 }
]

export const Proposals = ({tokenModule, memberAddresses}) => {
    const { proposals } = useProposals()
    const [proposalsFilter, setProposalsFilter] = useState(proposals) 
    const [selectedOption, setSelectedOption] = useState()

    useEffect(() => {
        setProposalsFilter(proposals)
    }, [proposals])

    const handleChangeOptions = (event) => {
        const option = event.currentTarget.value
        setSelectedOption(option)

        const options = {
            keys: ['state']
        }
        const proposalsFiltered = filer(proposals, options, option)
        if (proposalsFiltered.length) {
            setProposalsFilter(proposalsFiltered)
        } else if (option === 'all') {
            setProposalsFilter(proposals)
        } else {
            setProposalsFilter([])
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Proposals</h2>
                <Select options={proposalOptions} handleChange={handleChangeOptions} selectedOption={selectedOption} containerStyle="outline-none border-2 border-solid pl-2 rounded-md max-w-max bg-gray-100" />
            </div>
            <div className="flex flex-col gap-4">
                { proposalsFilter && proposalsFilter.map(({ proposalId, description, state, proposer, votes, executions, startBlock, endBlock }) => (
                    <Proposal
                        key={proposalId}
                        proposalId={proposalId} 
                        description={description}
                        state={state}
                        proposer={proposer}
                        votes={votes}
                        executions={executions}
                        startBlock={startBlock}
                        endBlock={endBlock}
                        tokenModule={tokenModule} />
                    )
                )}
                {!proposals.length && 
                    <div className="bg-white rounded-md p-2">
                        <Skeleton highlightColor="#C2CBD7" width={100} />
                        <Skeleton highlightColor="#C2CBD7" />
                        <Skeleton highlightColor="#C2CBD7" height={30} count={3} />
                        <Skeleton highlightColor="#C2CBD7" />
                    </div>
                }
                { proposals.length ? !proposalsFilter.length ? (
                    <div className="border border-solid border-gray-400 p-4 rounded-md">
                        <span className="text-white">{"Oops, we can't find any results"}</span>
                    </div> 
                ) : "" : ""
                }
            </div>
        </div>
    )
}