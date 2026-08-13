import type { ApiEndpoint } from "@/types/content";

/**
 * API Reference content (SRS Section 7.17). The interactive "Try it"
 * sandbox is explicitly Phase 2 per SRS ("Interactive 'Try it' console
 * (read-only sandbox, Phase 2)") — not built here for that reason, not
 * because of a missing dependency.
 */
export const apiEndpoints: ApiEndpoint[] = [
  {
    slug: "list-contacts",
    method: "GET",
    path: "/v1/contacts",
    summary: "List contacts",
    authRequired: true,
    parameters: [
      { name: "limit", type: "integer", required: false, description: "Max results to return (default 25, max 100)." },
      { name: "cursor", type: "string", required: false, description: "Pagination cursor from a previous response." },
    ],
    responseExample: `{
  "data": [
    { "id": "cnt_123", "email": "jane@example.com", "createdAt": "2026-07-01T12:00:00Z" }
  ],
  "nextCursor": "cnt_124"
}`,
  },
  {
    slug: "create-contact",
    method: "POST",
    path: "/v1/contacts",
    summary: "Create a contact",
    authRequired: true,
    parameters: [
      { name: "email", type: "string", required: true, description: "Contact's email address." },
      { name: "fullName", type: "string", required: false, description: "Contact's full name." },
    ],
    requestExample: `{
  "email": "jane@example.com",
  "fullName": "Jane Doe"
}`,
    responseExample: `{
  "id": "cnt_123",
  "email": "jane@example.com",
  "fullName": "Jane Doe",
  "createdAt": "2026-08-01T09:00:00Z"
}`,
  },
  {
    slug: "get-deal",
    method: "GET",
    path: "/v1/deals/{id}",
    summary: "Retrieve a deal",
    authRequired: true,
    parameters: [{ name: "id", type: "string", required: true, description: "The deal's unique ID." }],
    responseExample: `{
  "id": "deal_456",
  "stage": "proposal",
  "amount": 12000,
  "contactId": "cnt_123"
}`,
  },
  {
    slug: "list-webhooks",
    method: "GET",
    path: "/v1/webhooks",
    summary: "List webhook subscriptions",
    authRequired: true,
    parameters: [],
    responseExample: `{
  "data": [
    { "id": "whk_1", "url": "https://example.com/hook", "events": ["deal.closed"] }
  ]
}`,
  },
];

export function getApiEndpoint(slug: string) {
  return apiEndpoints.find((endpoint) => endpoint.slug === slug);
}
