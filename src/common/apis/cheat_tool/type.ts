export interface CheatToolItem {
  id: string;
  name: string;
  domain: string;
  link: string;
  ip_list: string[];
  process_win: string;
  process_mac: string;
}

export interface CheatToolListPayload {
  cheat_tool_list: CheatToolItem[];
  total_count: number;
}

export interface UpdateCheatToolRequest {
  id?: string;
  name: string;
  domain?: string;
  link?: string;
  ip_list?: string[];
  process_win?: string;
  process_mac?: string;
}
