/**
 * 
 * Default text - Plugin for calling callbacks on the events focus, and lose focus. 
 *
 * Author: Ilija Matoski
 *
 * Email: ilijamt@gmail.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://github.com/ilijamt/focusunfocuscallbacks
 *
 * Version:  0.2.1
 *
 * Features:
 *      Can add multiple callbacks on the focus of page event
 *      Prevents multiple focus/unfocus calls as the browsers fire those events multiple times
 *      
 * Usage:
 *  See README at project homepage
 *
 */

;
/**
 * 
 * @param {jQuery} $
 * @param {window} window
 * @param {document} document
 * @param {undefined} undefined
 * 
 * @returns undefined
 */
(function($, window, document, undefined) {
    "use strict";

    /**
     * Focus/Unfocus 
     * 
     * @param {Object} opts The options for the function
     * 
     * @returns {@exp;fuf@pro;prototype@pro;_singletonInstance}
     */
    function fuf(opts) {

        if (fuf.prototype._singletonInstance)
            return fuf.prototype._singletonInstance;

        fuf.prototype._singletonInstance = this;

        /**
         * Options
         * 
         * @type @exp;$@call;extend
         */
        this.options = $.extend({
            'events': {
                'focus': 'focus',
                'unfocus': 'blur'
            }
        },
        opts);

        /**
         * A list of callbacks to be executed upon focus 
         * 
         * @type {Object}
         */
        this.definitions = {
            'counters': {
                'focus': 1000,
                'unfocus': 1000
            },
            'focus': {
            },
            'unfocus': {
            }
        };

        /**
         * The focus state 
         * 
         * @type Number|Number|Number
         */
        this.focusState = 0;

        /**
         * Generate a key for the object 
         * 
         * @param {Object} target
         * 
         * @returns {Boolean|String}
         */
        this.generateKey = function(target) {

            if (typeof target === "undefined" || target === null || typeof this.definitions.counters[target] === "undefined") {
                return false;
            }
            
            this.definitions.counters[target]++;
            
            return this.definitions.counters[target];
               
        };

        /**
         * This is fired when we get focus on the window/tab
         * 
         * @returns {Boolean}
         */
        this.gotFocus = function() {
            if (this.focusState === 1) {
                // this is to prevent multiple firing of the same event
                return false;
            }
            this.focusState = 1; // we got the focus
            // call all the focus callbacks
            $.each(this.definitions.focus, function(key, callback) {
                setTimeout(callback);
            });
        };

        /**
         * This is fire when we lose focus on the window/tab
         * 
         * @returns {Boolean}
         */
        this.lostFocus = function() {
            if (this.focusState === 0) {
                // this is to prevent multiple firing of the same event
                return false;
            }
            this.focusState = 0; // we lost the focus
            // call all the unfocus callbacks
            $.each(this.definitions.unfocus, function(key, callback) {
                setTimeout(callback);
            });
        };

        /**
         * Remove the focus callback 
         * 
         * @param {type} callbackId
         * @returns {Boolean}
         */
        this.removeFocusCallback = function(callbackId) {

            if (typeof this.definitions.focus[callbackId] === "undefined" || (this.definitions.focus[callbackId] === null)) {
                return false;
            }

            delete this.definitions.focus[callbackId];

            return true;
        };

        /**
         * Remove the focus callback 
         * 
         * @param {type} callbackId
         * @returns {Boolean}
         */
        this.removeUnFocusCallback = function(callbackId) {

            if (typeof this.definitions.unfocus[callbackId] === "undefined" || (this.definitions.unfocus[callbackId] === null)) {
                return false;
            }

            delete this.definitions.unfocus[callbackId];

            return true;

        };

        /**
         * Add a callback for the focus event 
         * 
         * @param {Function} callback
         * @returns {Boolean|Number}
         */
        this.addFocusCallback = function(callback) {

            if (!(typeof callback === "function")) {
                return false;
            }

            var key = this.generateKey('focus');

            // console.log("addFocusCallback", callback, key);

            if (key === false) {
                return false;
            }

            this.definitions.focus[key] = callback;

            return key;

        };

        /**
         * Add a callback for the unfocus event 
         * 
         * @param {Function} callback
         * @returns {Boolean|Number}
         */
        this.addUnFocusCallback = function(callback) {

            if (!(typeof callback === "function")) {
                return false;
            }

            var key = this.generateKey('unfocus');

            // console.log("addUnFocusCallback", callback, key);

            if (key === false) {
                return false;
            }

            this.definitions.unfocus[key] = callback;

            return key;

        };

        /**
         * Bind the focus/unfocus events
         * 
         * @returns {undefined}
         */
        this.bindEvents = function() {

            var self = this;
            $(window).on(this.options.events.focus, function() {
                self.gotFocus();
            });
            $(window).on(this.options.events.unfocus, function() {
                self.lostFocus();
            });

        };

    }

    window.fuf = new fuf();
    window.fuf.bindEvents();

})(jQuery, window, document);