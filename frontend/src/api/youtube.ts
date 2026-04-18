const API_BASE_URL = "/api";

export const api = {
  async getVideoInfo(url: string): Promise<Response> {
    return fetch(`${API_BASE_URL}/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  },

  async startDownload(uuid: string, url: string, formatId?: string): Promise<Response> {
    return fetch(`${API_BASE_URL}/download/${uuid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format_id: formatId }),
    });
  },

  async getProgress(uuid: string): Promise<Response> {
    return fetch(`${API_BASE_URL}/progress/${uuid}`);
  },

  getFileUrl(uuid: string): string {
    return `${API_BASE_URL}/file/${uuid}`;
  },

  async sendCleanup(taskIds: string[]): Promise<Response> {
    return fetch(`${API_BASE_URL}/cleanup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_ids: taskIds }),
    });
  },
};
