export default interface HubspotResponse {
  status: string;
  message?: string;
  [key: string]: unknown;
}
