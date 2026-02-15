export interface AudienceOption {
    icon: string;
    label: string;
    description: string;
    systemPrompt: string;
}

export const audienceOptions: Record<string, AudienceOption> = {
    Executive: {
        icon: "🏢",
        label: "Executive",
        description: "High-level strategic summary, business impact, ROI focus. Minimal jargon.",
        systemPrompt: "You are simplifying technical content for executives. Provide a high-level strategic summary focusing on business impact, ROI, and key decisions. Use minimal jargon and emphasize outcomes over implementation details. Keep it concise and action-oriented."
    },
    Manager: {
        icon: "📋",
        label: "Manager",
        description: "Balanced overview with project status, risks, deadlines, and team implications.",
        systemPrompt: "You are simplifying technical content for managers. Provide a balanced overview that includes project status, potential risks, deadlines, and team implications. Include enough technical detail for informed decision-making while remaining accessible."
    },
    Client: {
        icon: "🤝",
        label: "Client",
        description: "Non-technical explanation focused on deliverables, timelines, and outcomes.",
        systemPrompt: "You are simplifying technical content for clients. Provide a non-technical explanation focused on deliverables, timelines, and tangible outcomes. Avoid technical jargon entirely and emphasize what the client will receive and when."
    },
    Intern: {
        icon: "🎓",
        label: "Intern",
        description: "Detailed, plain-language walkthrough with definitions and context for every concept.",
        systemPrompt: "You are simplifying technical content for interns or beginners. Provide a detailed, plain-language walkthrough with clear definitions and context for every technical concept. Be educational and thorough, explaining the 'why' behind decisions."
    }
};

export const getAudienceSystemPrompt = (audience: string): string => {
    return audienceOptions[audience]?.systemPrompt || audienceOptions.Manager.systemPrompt;
};
