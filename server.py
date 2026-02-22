"""Local dev server that mimics Apache .htaccess clean URL rewriting."""
import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Strip query string for file lookup
        path = self.path.split("?")[0]

        # If path has no extension and isn't a directory, try .html
        if not os.path.splitext(path)[1] and not path.endswith("/"):
            html_path = os.path.join(os.getcwd(), path.lstrip("/") + ".html")
            if os.path.isfile(html_path):
                self.path = path + ".html"

        return super().do_GET()

if __name__ == "__main__":
    PORT = 8080
    with http.server.HTTPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
