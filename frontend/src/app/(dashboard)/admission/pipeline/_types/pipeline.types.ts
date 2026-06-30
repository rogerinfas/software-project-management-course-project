import type { components } from "@/lib/api/types/api";

export type Prospect = components["schemas"]["ProspectResponse"];
export type Interaction = components["schemas"]["ProspectInteractionResponse"];

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type Level = "INITIAL" | "PRIMARY" | "SECONDARY";
