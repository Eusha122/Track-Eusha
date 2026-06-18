# Eusha Locator - Project Context

## Project Overview

Eusha Locator is a premium mission-based location tracking experience.

This is NOT a traditional GPS tracker.

This is NOT a social media application.

This is NOT a map application.

The product should feel like a high-end interactive mission where the user is attempting to locate a specific person called "Eusha".

The experience should feel memorable, polished, cinematic, and professional.

The app should create excitement and curiosity while remaining elegant and minimalist.

---

# Core Concept

A user opens the application and begins a mission called:

"Operation: Find Eusha"

The user receives intelligence, mission updates, radar information, navigation assistance, and live tracking data.

The application transforms a simple GPS tracking task into an immersive experience.

The user should feel like they are participating in a real mission.

---

# Main Characters

## Eusha

The target.

The person being located.

Eusha's device broadcasts GPS coordinates through a hidden tracker route.

Eusha is presented throughout the application as a mysterious target.

The tone should be playful and intelligent.

Never portray Eusha as dangerous.

Examples:

* "Target detected."
* "Signal acquired."
* "The target remains elusive."
* "Visual contact may be possible."

Examples to avoid:

* Criminal language
* Aggressive military language
* Violent themes

The tone should remain lighthearted.

---

## Tasmia

The primary user.

The hunter.

The person attempting to locate Eusha.

All messages should feel personalized.

The experience should feel designed specifically for her.

---

# Design Philosophy

The interface must feel:

* Premium
* Sophisticated
* Minimal
* Modern
* Professional

Never feel:

* Childish
* Cartoonish
* Cheap
* Overly colorful
* Meme-like

---

# Visual Identity

## Colors

Primary:
Black

Secondary:
White

Accent:
Very limited

Avoid:

* Rainbow colors
* Neon colors
* Bright gaming effects
* Excessive visual noise

---

# Typography

Modern

Elegant

Highly readable

Generous spacing

Strong hierarchy

Minimal clutter

---

# User Experience

Every screen should have a purpose.

Every animation should feel intentional.

Every interaction should feel smooth.

The user should never feel overwhelmed.

The interface should feel calm and confident.

---

# Technical Stack

Frontend:

* React
* TypeScript
* Tailwind CSS
* Framer Motion

Backend:

* Firebase
* Firestore

Maps:

* OpenStreetMap
* Leaflet

Location:

* Geolocation API

---

# System Architecture

## Tracker Mode

Route:

/tracker

Purpose:

Used only by Eusha.

Responsibilities:

* Request GPS permission
* Continuously obtain device location
* Update Firebase
* Show tracking status

No manual coordinate entry.

No map dragging.

No manual location selection.

GPS only.

---

## Hunter Mode

Route:

/

Purpose:

Used by Tasmia.

Responsibilities:

* Read Eusha location
* Determine user location
* Calculate distance
* Calculate bearing
* Display mission status
* Display navigation guidance

---

# Core Features

## Mission Briefing

Introduces the operation.

Creates immersion.

Explains the objective.

---

## Live Radar

Visual representation of tracking activity.

Must feel professional.

Must not feel fake or decorative.

---

## Distance Tracking

Realtime distance calculation.

Examples:

842m

120m

34m

7m

---

## Compass Navigation

Points directly toward Eusha.

Updates continuously.

Uses real-world direction.

---

## Mission Feed

Displays dynamic mission updates.

Examples:

"Signal strength increasing."

"Target appears stationary."

"Movement detected."

"The operation continues."

---

## Achievement System

Examples:

First Contact

Signal Acquired

Close Target

Visual Range

Target Found

Achievements should feel rewarding.

---

## Mission Completion

Triggered when user is extremely close to Eusha.

Displays:

TARGET FOUND

Operation Complete

Mission statistics

Celebration sequence

---

# Writing Style

Tone:

* Smart
* Calm
* Slightly playful
* Confident

Avoid:

* Cringe humor
* Excessive jokes
* Internet slang
* Emojis

The writing should feel like a premium product.

---

# Quality Standards

This project should feel comparable to a commercial startup product.

Code should be:

* Clean
* Maintainable
* Scalable
* Modular

UI should feel:

* Refined
* Intentional
* Production ready

Every feature should support the mission experience.

Never add random elements that break immersion.
