import React, { Component, Fragment } from 'react';

class NavHelper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Nav toggle
            navMethod: false,
            // Search
            searchMethod: false,
            // Cart
            offerModal: false,
            // Canvas
            offerStrip: false,
            // Sticky
            windowSize: "",
            stickyheader: 0,
            offerComponent: 0,
        };
        // Nav toggle
        this.toggleNav = this.toggleNav.bind(this);
        // Search
        this.toggleSearch = this.toggleSearch.bind(this);
        // Cart
        this.offerModalBtn = this.offerModalBtn.bind(this);
        // Canvas
        this.offerStripBtn = this.offerStripBtn.bind(this);
    }
    // Nav toggle
    toggleNav() {
        this.setState({
            navmethod: !this.state.navmethod
        });
        let element = document.getElementById('body');
        element.classList.add('hm-drawer-open');
    }
    closeToggleNav() {
        let element = document.getElementById('body');
        element.classList.remove('hm-drawer-open');
    }
    // Search toggle
    toggleSearch() {
        this.setState({
            searchMethod: !this.state.searchMethod
        });
        let element = document.getElementById('body');
        element.classList.toggle('hm-search-open');
    }
    // Cart toggle
    offerModalBtn() {
        this.setState({
            offerModal: !this.state.offerModal
        });
    }
    // Canvas toggle
    offerStripBtn() {
        this.setState({
            offerStrip: !this.state.offerStrip
        });
    }
    // Sticky header
    StickyHeader = e => {
        const windowSize = window.scrollY;
        const stickyheader = (windowSize > 100);
        this.setState(prevState => {
            return {
                stickyheader
            };
        });
    };
    // Offer Component
    OfferComponent = e => {
        const windowSize = window.scrollY;
        const offerComponent = (windowSize > 100);
        this.setState(prevState => {
            return {
                offerComponent
            };
        });
    };
    componentDidMount() {
        window.addEventListener("load", this.closeToggleNav);
        window.addEventListener("scroll", this.StickyHeader);
        window.addEventListener("scroll", this.OfferComponent);
    }
    componentWillUnmount() {
        this.closeToggleNav();
        window.removeEventListener("scroll", this.StickyHeader);
        window.removeEventListener("scroll", this.OfferComponent);
    }
    // Mobile menu
    getNextSibling = function (elem, selector) {
        // Get the next sibling element
        var sibling = elem.nextElementSibling;
        // If there's no selector, return the first sibling
        if (!selector) return sibling;
        // If the sibling matches our selector, use it
        // If not, jump to the next sibling and continue the loop
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.nextElementSibling
        }
    }

    triggerChild = (e) => {
        let subMenu = '';

        subMenu = (this.getNextSibling(e.target, '.collapse') !== undefined) ? this.getNextSibling(e.target, '.collapse') : null;

        if (subMenu !== null && subMenu !== undefined && subMenu !== '') {
            subMenu.classList = subMenu.classList.contains('d-block') ? 'collapse' : 'collapse d-block';
        }
    }
    render() {
        return (
            <Fragment />
        );
    }
}

export default NavHelper;