/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/// <reference path="../_references.ts"/>

module powerbitests.customVisuals {
    import VisualClass = powerbi.visuals.samples.Histogram;

    describe("HistogramChart", () => {
        describe('capabilities', () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {
            let visualBuilder: HistogramChartBuilder;
            let dataViews: powerbi.DataView[];

            beforeEach(() => {
                visualBuilder = new HistogramChartBuilder();
                dataViews = [powerbitests.customVisuals.sampleDataViews.valueByAgeData()];
            });

            it("svg element created", () => expect(visualBuilder.element.children("svg")[0]).toBeInDOM());
            it("update", (done) => {
                visualBuilder.update(dataViews);
                setTimeout(() => {                    
                    var binsNumber = d3.layout.histogram().frequency(true)(dataViews[0].categorical.categories[0].values).length;
                    expect(visualBuilder.element.find('.column').length).toBe(binsNumber);
                    done();
                }, DefaultWaitForRender);
            });
        });
    });

    class HistogramChartBuilder {
        private isMinervaVisualPlugin: boolean = false;
        private visual: VisualClass;
        private host: powerbi.IVisualHostServices;
        private style: powerbi.IVisualStyle;
        private viewport: powerbi.IViewport;
        public element: JQuery;

        constructor(
            height: number = 200,
            width: number = 300,
            isMinervaVisualPlugin: boolean = false) {

            this.element = powerbitests.helpers.testDom(height.toString(), width.toString());
            this.host = mocks.createVisualHostServices();
            this.style = powerbi.visuals.visualStyles.create();
            this.isMinervaVisualPlugin = isMinervaVisualPlugin;
            this.viewport = {
                height: this.element.height(),
                width: this.element.width()
            };

            this.build();
            this.init();
        }

        private build(): void {
            this.visual = new VisualClass();
        }

        private init(): void {
            this.visual.init({
                element: this.element,
                host: this.host,
                style: this.style,
                viewport: this.viewport
            });
        }

        public update(dataViews: powerbi.DataView[]): void {
            this.visual.update(<powerbi.VisualUpdateOptions>{
                dataViews: dataViews,
                viewport: this.viewport
            });
        }
    }
}

