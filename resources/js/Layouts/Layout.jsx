import LayoutNavigation from "./partials/LayoutNavigation";
import LayoutFooter from "./partials/LayoutFooter";

export default function Layout({ children }) {
    return (
        <main className="min-vh-100 d-flex flex-column">
            <LayoutNavigation />
            <div className="flex-grow-1">{children}</div>
            <LayoutFooter />
        </main>
    );
}
