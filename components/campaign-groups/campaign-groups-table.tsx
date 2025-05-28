"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { CampaignGroup } from "@/lib/campaign-group-types"
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react"
import EditCampaignGroupDialog from "./edit-campaign-group-dialog"
import DeleteCampaignGroupDialog from "./delete-campaign-group-dialog"

interface CampaignGroupsTableProps {
  campaignGroups: CampaignGroup[]
  unassignedCount: number
  onUpdateGroup?: (id: string, data: Partial<CampaignGroup>) => Promise<CampaignGroup | null>
  onDeleteGroup?: (id: string) => Promise<boolean>
}

export default function CampaignGroupsTable({ 
  campaignGroups, 
  unassignedCount,
  onUpdateGroup,
  onDeleteGroup 
}: CampaignGroupsTableProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editingGroup, setEditingGroup] = useState<CampaignGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<CampaignGroup | null>(null)

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const handleEditClick = (group: CampaignGroup) => {
    setEditingGroup({ ...group })
  }

  const handleDeleteClick = (group: CampaignGroup) => {
    setDeletingGroup({ ...group })
  }

  const handleUpdateGroup = async (updatedGroup: CampaignGroup) => {
    if (onUpdateGroup && editingGroup) {
      try {
        await onUpdateGroup(editingGroup.id, {
          name: updatedGroup.name,
          description: updatedGroup.description,
          targetAcos: updatedGroup.targetAcos,
          presetGoal: updatedGroup.presetGoal,
          bidCeiling: updatedGroup.bidCeiling,
          bidFloor: updatedGroup.bidFloor
        })
        setEditingGroup(null)
      } catch (error) {
        console.error('Failed to update campaign group:', error)
      }
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (onDeleteGroup) {
      try {
        await onDeleteGroup(groupId)
        setDeletingGroup(null)
      } catch (error) {
        console.error('Failed to delete campaign group:', error)
      }
    }
  }

  // Sort the campaign groups by name
  const sortedGroups = [...campaignGroups].sort((a, b) => {
    if (sortDirection === "asc") {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="cursor-pointer font-medium" onClick={toggleSort}>
                <div className="flex items-center">
                  Name
                  {sortDirection === "asc" ? (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-medium">Actions</TableHead>
              <TableHead className="font-medium">Target ACOS</TableHead>
              <TableHead className="font-medium">Prioritization</TableHead>
              <TableHead className="font-medium">Bid Ceiling</TableHead>
              <TableHead className="font-medium">Bid Floor</TableHead>
              <TableHead className="font-medium"># of Campaigns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedGroups.map((group) => (
              <TableRow key={group.id} className="group">
                <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                  {group.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(group)}>
                      <Pencil className="h-4 w-4 text-gray-500" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      onClick={() => handleDeleteClick(group)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{group.targetAcos ? `${group.targetAcos}%` : "Not Set"}</TableCell>
                <TableCell className="whitespace-nowrap">{group.presetGoal}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {group.bidCeiling ? `$${Number(group.bidCeiling).toFixed(2)}` : "Not Set"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {group.bidFloor ? `$${Number(group.bidFloor).toFixed(2)}` : "Not Set"}
                </TableCell>
                <TableCell className="whitespace-nowrap">{group.campaigns.length}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-medium">Unassigned</TableCell>
              <TableCell>{/* Empty actions cell for consistency */}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{unassignedCount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {editingGroup && (
        <EditCampaignGroupDialog
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
          campaignGroup={editingGroup}
          onUpdateGroup={handleUpdateGroup}
        />
      )}

      {deletingGroup && (
        <DeleteCampaignGroupDialog
          open={!!deletingGroup}
          onOpenChange={(open) => !open && setDeletingGroup(null)}
          campaignGroup={deletingGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      )}
    </div>
  )
}
