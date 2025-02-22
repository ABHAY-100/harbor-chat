module.exports = {
  async headers() {
      return [
          {
              source: "/api/socket_io",
              headers: [
                  {
                      key: "Access-Control-Allow-Origin",
                      value: "*",
                  },
                  {
                      key: "Connection",
                      value: "keep-alive",
                  },
              ],
          },
      ];
  },
};
