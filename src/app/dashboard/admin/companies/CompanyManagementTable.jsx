"use client";

import React, { useState, useMemo } from "react";
import { Table, Avatar, Chip, Button, Input, Modal, Tabs, Separator } from "@heroui/react";
import { Magnifier, Check, Xmark, Eye, ArrowUpRightFromSquare, MapPin, Persons, Calendar, Briefcase } from "@gravity-ui/icons";

const STATUS_COLOR_MAP = {
    Approved: "success",
    Pending: "warning",
    Rejected: "danger",
};

export default function CompanyManagementTable({ initialCompanies = [] }) {
    const [companies, setCompanies] = useState(initialCompanies);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    // Filter companies by status tab and search query
    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            const matchesStatus = statusFilter === "all" || company.status?.toLowerCase() === statusFilter.toLowerCase();

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query || company.name?.toLowerCase().includes(query) || company.industry?.toLowerCase().includes(query) || company.location?.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [companies, statusFilter, searchQuery]);

    // Quick status counts for the filter tabs
    const counts = useMemo(() => {
        return companies.reduce(
            (acc, item) => {
                acc.all += 1;
                const key = item.status?.toLowerCase();
                if (key && acc[key] !== undefined) acc[key] += 1;
                return acc;
            },
            { all: 0, pending: 0, approved: 0, rejected: 0 },
        );
    }, [companies]);

    // Handle Approve / Reject action
    const handleStatusChange = async (companyId, newStatus) => {
        setUpdatingId(companyId);
        try {
            // Replace with your actual API endpoint or server action
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/companies/${companyId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update company status");

            setCompanies((prev) => prev.map((c) => (c._id === companyId ? { ...c, status: newStatus } : c)));

            if (selectedCompany?._id === companyId) {
                setSelectedCompany((prev) => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error("Status update error:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const openDetails = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-5">
            {/* Top Filter & Search Bar */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Tabs selectedKey={statusFilter} onSelectionChange={(key) => setStatusFilter(String(key))} className="w-full lg:w-auto">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Filter companies by status">
                            <Tabs.Tab id="all">
                                All ({counts.all})
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="pending">
                                Pending ({counts.pending})
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="approved">
                                Approved ({counts.approved})
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="rejected">
                                Rejected ({counts.rejected})
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>

                <div className="relative w-full lg:w-80">
                    <Magnifier className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-default-400" />
                    <Input aria-label="Search companies" placeholder="Search name, industry, or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9" />
                </div>
            </div>

            {/* Responsive Table Container */}
            <Table>
                <Table.ScrollContainer className="overflow-x-auto rounded-2xl border border-default-200 bg-background shadow-xs">
                    <Table.Content aria-label="Companies for review" className="min-w-[820px]">
                        <Table.Header>
                            <Table.Column isRowHeader>Company</Table.Column>
                            <Table.Column>Industry & Size</Table.Column>
                            <Table.Column>Location</Table.Column>
                            <Table.Column>Submitted</Table.Column>
                            <Table.Column>Status</Table.Column>
                            <Table.Column className="text-right">Actions</Table.Column>
                        </Table.Header>

                        <Table.Body
                            items={filteredCompanies}
                            renderEmptyState={() => (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-base font-medium text-foreground">No companies found</p>
                                    <p className="mt-1 text-sm text-default-500">Try adjusting your search query or status filter.</p>
                                </div>
                            )}
                        >
                            {(company) => {
                                const isBusy = updatingId === company._id;
                                return (
                                    <Table.Row key={company._id}>
                                        {/* Company Info */}
                                        <Table.Cell>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="md" className="shrink-0 rounded-xl">
                                                    <Avatar.Image src={company.logo} alt={company.name} />
                                                    <Avatar.Fallback>{company.name?.slice(0, 2).toUpperCase() || "CO"}</Avatar.Fallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-foreground">{company.name}</p>
                                                    {company.websiteUrl && (
                                                        <a
                                                            href={company.websiteUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                        >
                                                            <span className="max-w-[180px] truncate">{company.websiteUrl.replace(/^https?:\/\//, "")}</span>
                                                            <ArrowUpRightFromSquare className="size-3 shrink-0" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </Table.Cell>

                                        {/* Industry & Employee Count */}
                                        <Table.Cell>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-foreground">{company.industry || "—"}</p>
                                                <p className="text-xs text-default-500">{company.employeeCount || "Size unspecified"}</p>
                                            </div>
                                        </Table.Cell>

                                        {/* Location */}
                                        <Table.Cell>
                                            <span className="inline-flex items-center gap-1.5 text-sm text-default-600">
                                                <MapPin className="size-3.5 shrink-0 text-default-400" />
                                                {company.location || "Remote"}
                                            </span>
                                        </Table.Cell>

                                        {/* Created Date */}
                                        <Table.Cell>
                                            <span className="text-sm text-default-500">{formatDate(company.createdAt)}</span>
                                        </Table.Cell>

                                        {/* Status Chip */}
                                        <Table.Cell>
                                            <Chip size="sm" variant="soft" color={STATUS_COLOR_MAP[company.status] || "default"}>
                                                <Chip.Label>{company.status}</Chip.Label>
                                            </Chip>
                                        </Table.Cell>

                                        {/* Action Buttons */}
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <div title="Details">
                                                    <Button size="sm" variant="ghost" isIconOnly aria-label={`View ${company.name} details`} onPress={() => openDetails(company)}>
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </div>

                                                {company.status !== "Approved" && (
                                                    <div title="Approve?">
                                                        <Button
                                                            size="sm"
                                                            variant="soft"
                                                            color="success"
                                                            isIconOnly
                                                            isDisabled={isBusy}
                                                            aria-label={`Approve ${company.name}`}
                                                            onPress={() => handleStatusChange(company._id, "Approved")}
                                                        >
                                                            <Check className="size-4 text-green-600" />
                                                        </Button>
                                                    </div>
                                                )}

                                                {company.status !== "Rejected" && (
                                                    <div title="Reject?">
                                                        <Button
                                                            size="sm"
                                                            variant="soft"
                                                            color="danger"
                                                            isIconOnly
                                                            isDisabled={isBusy}
                                                            aria-label={`Reject ${company.name}`}
                                                            onPress={() => handleStatusChange(company._id, "Rejected")}
                                                        >
                                                            <Xmark className="size-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

            {/* Company Details & Review Modal */}
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Backdrop>
                    <Modal.Container size="lg">
                        <Modal.Dialog>
                            {selectedCompany && (
                                <>
                                    <Modal.CloseTrigger />
                                    <Modal.Header className="flex flex-row items-center gap-3.5">
                                        <Avatar size="lg" className="rounded-xl">
                                            <Avatar.Image src={selectedCompany.logo} alt={selectedCompany.name} />
                                            <Avatar.Fallback>{selectedCompany.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Modal.Heading className="truncate">{selectedCompany.name}</Modal.Heading>
                                                <Chip size="sm" variant="soft" color={STATUS_COLOR_MAP[selectedCompany.status] || "default"}>
                                                    <Chip.Label>{selectedCompany.status}</Chip.Label>
                                                </Chip>
                                            </div>
                                            {selectedCompany.websiteUrl && (
                                                <a
                                                    href={selectedCompany.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                >
                                                    {selectedCompany.websiteUrl}
                                                    <ArrowUpRightFromSquare className="size-3" />
                                                </a>
                                            )}
                                        </div>
                                    </Modal.Header>

                                    <Separator className="my-2" />

                                    <Modal.Body className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="flex items-center gap-2.5 rounded-xl bg-default-100/70 p-3">
                                                <Briefcase className="size-4 text-default-500" />
                                                <div>
                                                    <p className="text-xs text-default-500">Industry</p>
                                                    <p className="text-sm font-medium">{selectedCompany.industry || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2.5 rounded-xl bg-default-100/70 p-3">
                                                <Persons className="size-4 text-default-500" />
                                                <div>
                                                    <p className="text-xs text-default-500">Company Size</p>
                                                    <p className="text-sm font-medium">{selectedCompany.employeeCount || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2.5 rounded-xl bg-default-100/70 p-3">
                                                <MapPin className="size-4 text-default-500" />
                                                <div>
                                                    <p className="text-xs text-default-500">Location</p>
                                                    <p className="text-sm font-medium">{selectedCompany.location || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2.5 rounded-xl bg-default-100/70 p-3">
                                                <Calendar className="size-4 text-default-500" />
                                                <div>
                                                    <p className="text-xs text-default-500">Submitted On</p>
                                                    <p className="text-sm font-medium">{formatDate(selectedCompany.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-default-500">About Company</p>
                                            <div className="rounded-xl border border-default-200 bg-default-50 p-3.5 text-sm leading-relaxed text-default-700 whitespace-pre-line">
                                                {selectedCompany.description?.trim() || "No description provided."}
                                            </div>
                                        </div>

                                        <p className="text-xs text-default-400">
                                            Recruiter ID: <span className="font-mono">{selectedCompany.recruiterId}</span>
                                        </p>
                                    </Modal.Body>

                                    <Modal.Footer className="flex flex-wrap justify-end gap-2">
                                        <Button variant="ghost" onPress={() => setIsModalOpen(false)}>
                                            Close
                                        </Button>
                                        {selectedCompany.status !== "Rejected" && (
                                            <Button color="danger" variant="soft" isDisabled={updatingId === selectedCompany._id} onPress={() => handleStatusChange(selectedCompany._id, "Rejected")}>
                                                <Xmark className="size-4" />
                                                Reject
                                            </Button>
                                        )}
                                        {selectedCompany.status !== "Approved" && (
                                            <Button color="success" isDisabled={updatingId === selectedCompany._id} onPress={() => handleStatusChange(selectedCompany._id, "Approved")}>
                                                <Check className="size-4" />
                                                Approve Company
                                            </Button>
                                        )}
                                    </Modal.Footer>
                                </>
                            )}
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}
