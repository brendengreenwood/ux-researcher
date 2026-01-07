'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LucideIcon, MoreVertical } from 'lucide-react'

export interface ActionItem {
  id: string
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive'
}

interface ActionButtonsProps {
  actions: ActionItem[]
}

const MAX_INLINE_ACTIONS = 4

export function ActionButtons({ actions }: ActionButtonsProps) {
  const inlineActions = actions.slice(0, MAX_INLINE_ACTIONS)
  const menuActions = actions.slice(MAX_INLINE_ACTIONS)
  const hasMoreMenu = menuActions.length > 0

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 justify-center" style={{ minWidth: '168px' }}>
        {inlineActions.map((action) => {
          const IconComponent = action.icon
          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    action.onClick()
                  }}
                >
                  <IconComponent className={`h-4 w-4 ${action.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {action.label}
              </TooltipContent>
            </Tooltip>
          )
        })}

        {hasMoreMenu && (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-accent"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                More actions
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              {menuActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick()
                    }}
                  >
                    <IconComponent className={`h-4 w-4 mr-2 ${action.variant === 'destructive' ? 'text-destructive' : ''}`} />
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  )
}
