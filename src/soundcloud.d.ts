declare module "soundcloud" {
  interface SCType {
    initialize: (options: { client_id: string }) => void;

    oEmbed: (
      playlistId: string,
      { auto_play: string, element: string }
    ) => Promise<any>;

    get: (
      apiPath: string,
      options: {
        genres: string;
        bpm: { from: number };
      }
    ) => Promise<any>;
  }

  var SC: SCType;
  export default SC;
}
