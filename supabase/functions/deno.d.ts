// Type declarations for Deno runtime used in Supabase Edge Functions
declare global {
    namespace Deno {
        const env: {
            get(key: string): string | undefined;
        };
    }
}

export { };

