'use client';

import { TableCardBody } from '@/app/components/common/TableCardBody';
import { ErrorCard } from '@/app/components/common/ErrorCard';
import React from 'react';
import { ExternalLink } from 'react-feather';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;


export default function SolkeeperPageClient({ params: { address } }: Props) {
    let auditInfoTXTarray: AuditInfoTXT[] = [
        {
            address: "address1",
            bytecodehash: "hash1",
            report_url: "https://google.com/",
            audit_summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            timestamp: "1696580642",
            auditor_name: "Torii",
        },
        {
            address: "address2",
            bytecodehash: "hash2",
            report_url: "https://yahoo.com/",
            audit_summary: "Looks bad to me :(",
            timestamp: "1691051042",
            auditor_name: "SecurityCompany A",
        }
    ];

    const deployedCodeHash = getDeployedCodeHashForAddress(address);
    const auditInfoPresent = true;

    if (!auditInfoPresent) {
        return <ErrorCard text={"No security review was found for this program."} />
    }

    return auditInfoTXTarray.map((element, id) => {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-header-title mb-0 d-flex align-items-center">Security Review by {element.auditor_name} {insertOutdatedDiv(element.bytecodehash, deployedCodeHash)}</h3>
                </div>
                <TableCardBody>
                    {ROWS.filter(x => x.key in element).map((x, idx) => {
                        return (<tr key={idx}>
                            <td className="w-100">{x.display}</td>
                            <RenderEntry value={element[x.key]} type={x.type} />
                        </tr>);
                    })
                    }
                </TableCardBody>
            </div>
        )
    });
}

type AuditInfoTXT = {
    address: string,
    bytecodehash: string,
    report_url: string,
    audit_summary: string,
    timestamp: string,
    auditor_name: string
};
enum DisplayType {
    String,
    URL,
    Number,
    Date,
}
type TableRow = {
    display: string;
    key: keyof AuditInfoTXT;
    type: DisplayType;
};

const ROWS: TableRow[] = [
    {
        display: "Date",
        key: "timestamp",
        type: DisplayType.Date
    },
    {
        display: "Security Review address",
        key: "address",
        type: DisplayType.String,
    },
    {
        display: "Report URL",
        key: "report_url",
        type: DisplayType.URL,
    },
    {
        display: "Review summary",
        key: "audit_summary",
        type: DisplayType.String,
    },

];

function insertOutdatedDiv(bytecodehash: string, deployedcodehash: string) {
    if (deployedcodehash === bytecodehash) {
        return <></>
    }

    return (
        <div style={{ color: "red", marginLeft: "15px" }}>OUTDATED</div>
    )
}

function getDeployedCodeHashForAddress(address: string) {
    // mock implementation
    return "hash1";
}

function isValidLink(value: string) {
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol);
    } catch (err) {
        return false;
    }
}

function RenderEntry({ value, type }: { value: AuditInfoTXT[keyof AuditInfoTXT]; type: DisplayType }) {
    if (!value) {
        return <></>;
    }

    switch (type) {
        case DisplayType.String:
            if (value.length > 120) {
                return <td className="text-lg-end font-monospace">{value.slice(0, 121) + "..."}</td>;
            } else {
                return <td className="text-lg-end font-monospace">{value}</td>;
            }
        case DisplayType.Date:
            return <td className="text-lg-end font-monospace">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(parseInt(value) * 1000)}</td>;
        case DisplayType.URL:
            if (isValidLink(value)) {
                return (
                    <td className="text-lg-end">
                        <span className="font-monospace">
                            <a rel="noopener noreferrer" target="_blank" href={value}>
                                {value}
                                <ExternalLink className="align-text-top ms-2" size={13} />
                            </a>
                        </span>
                    </td>
                );
            }
            return (
                <td className="text-lg-end">
                    <pre>{value.trim()}</pre>
                </td>
            );
    }

    return <></>;
}