import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  FileText,
  Search,
  Users,
} from 'lucide-react'

const costData = {
  totalThisMonth: 125.50,
  budgetLimit: 200,
  changeFromLastMonth: 15.3,
  byFeature: [
    { name: 'Task Extraction', cost: 75.30, icon: Zap, color: 'bg-blue-500' },
    { name: 'Documentation', cost: 30.20, icon: FileText, color: 'bg-green-500' },
    { name: 'Duplicate Detection', cost: 15.00, icon: Search, color: 'bg-purple-500' },
    { name: 'Team Assignment', cost: 5.00, icon: Users, color: 'bg-orange-500' },
  ],
  recentUsage: [
    { date: 'Jan 7, 2026', feature: 'Task Extraction', model: 'claude-sonnet-4', tokens: 2500, cost: 0.045 },
    { date: 'Jan 7, 2026', feature: 'Documentation', model: 'claude-sonnet-4', tokens: 1800, cost: 0.032 },
    { date: 'Jan 6, 2026', feature: 'Task Extraction', model: 'claude-sonnet-4', tokens: 3200, cost: 0.058 },
    { date: 'Jan 6, 2026', feature: 'Duplicate Detection', model: 'text-embedding-3-small', tokens: 500, cost: 0.001 },
    { date: 'Jan 5, 2026', feature: 'Task Extraction', model: 'claude-sonnet-4', tokens: 2100, cost: 0.038 },
  ],
}

export default function CostsPage() {
  const budgetPercent = (costData.totalThisMonth / costData.budgetLimit) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Costs</h1>
        <p className="text-gray-500">Monitor your AI API usage and costs</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total This Month</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <DollarSign className="h-6 w-6 text-gray-400" />
              {costData.totalThisMonth.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm">
              {costData.changeFromLastMonth > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">+{costData.changeFromLastMonth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{costData.changeFromLastMonth}%</span>
                </>
              )}
              <span className="text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Budget Used</CardDescription>
            <CardTitle className="text-3xl">
              {budgetPercent.toFixed(0)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={budgetPercent} className="mb-2" />
            <p className="text-sm text-gray-500">
              ${costData.totalThisMonth.toFixed(2)} of ${costData.budgetLimit} limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Cost per Meeting</CardDescription>
            <CardTitle className="text-3xl">$2.15</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Based on 58 meetings processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Feature */}
      <Card>
        <CardHeader>
          <CardTitle>Cost by Feature</CardTitle>
          <CardDescription>Breakdown of AI usage across features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costData.byFeature.map((feature) => {
              const percent = (feature.cost / costData.totalThisMonth) * 100
              return (
                <div key={feature.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded p-1.5 ${feature.color.replace('bg-', 'bg-opacity-20 ')}`}>
                        <feature.icon className={`h-4 w-4 ${feature.color.replace('bg-', 'text-')}`} />
                      </div>
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">${feature.cost.toFixed(2)}</span>
                      <span className="ml-2 text-xs text-gray-500">({percent.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${feature.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Calls</CardTitle>
          <CardDescription>Detailed log of AI API usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Feature</th>
                  <th className="pb-3 font-medium">Model</th>
                  <th className="pb-3 text-right font-medium">Tokens</th>
                  <th className="pb-3 text-right font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {costData.recentUsage.map((usage, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">{usage.date}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{usage.feature}</Badge>
                    </td>
                    <td className="py-3">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                        {usage.model}
                      </code>
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {usage.tokens.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-medium">
                      ${usage.cost.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
