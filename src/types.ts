export type Timer = {
    timeName: string;
    timeLength: number | undefined;
    timeAfter: number;
};

export type Values = {
    timers: Timer[];
};
