export interface Tileset {
    type: string;
    id: string;
    name: string;
    center: [number, number, number];
    created: string;
    modified: string;
    visibility: string;
    description: string;
    filesize: number;
    status: string;
    tileset_precisions: {
      free: number;
    };
    created_by_client: any; // Use `any` if the type is not known
    cu: number;
  }