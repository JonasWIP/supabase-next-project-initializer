import React from 'react';

type FooterProps = {
    companyName?: string;
    links?: Array<{ label: string; href: string }>;
};

const Footer: React.FC<FooterProps> = ({
    companyName = 'Your Company',
    links = [],
}) => {
    
    return (
        <footer className="bg-muted/50 border-t border-border py-6">
            <div className="container mx-auto text-center">
            <p className="mb-4 text-foreground">{companyName} &copy; {new Date().getFullYear()}</p>
            <ul className="flex justify-center space-x-4">
                {links.map((link, index) => (
                <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-foreground transition duration-300"
                    >
                      {link.label}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        </footer>
    );
};

export default Footer;