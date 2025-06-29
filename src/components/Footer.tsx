"use client";
import React from "react";
import { Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 dark:text-red-400 fill-current" />
            <span>by</span>
            <a
              href="https://github.com/manish-9245"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Manish Tiwari
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
