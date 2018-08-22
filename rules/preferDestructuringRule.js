"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var ts = require("typescript");
var tslint_1 = require("tslint");
var options = {
    type: 'array',
    properties: {
        VariableDeclarator: {
            type: 'object',
            properties: {
                array: {
                    type: 'boolean'
                },
                object: {
                    type: 'boolean'
                }
            },
            additionalProperties: false
        },
        AssignmentExpression: {
            type: 'object',
            properties: {
                array: {
                    type: 'boolean'
                },
                object: {
                    type: 'boolean'
                }
            },
            additionalProperties: false
        }
    }
};
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PerferDestructuringWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'prefer-destructuring',
        type: 'style',
        description: tslint_1.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      require destructuring from arrays and/or objects\n    "], ["\n      require destructuring from arrays and/or objects\n    "]))),
        optionsDescription: tslint_1.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""]))),
        options: null,
        optionExamples: [
            [
                true,
                {
                    VariableDeclarator: {
                        array: false,
                        object: true
                    },
                    AssignmentExpression: {
                        array: true,
                        object: true
                    }
                },
                {
                    enforceForRenamedProperties: false
                },
            ],
        ],
        typescriptOnly: false
    };
    return Rule;
}(tslint_1.Rules.AbstractRule));
exports.Rule = Rule;
var PerferDestructuringWalker = /** @class */ (function (_super) {
    __extends(PerferDestructuringWalker, _super);
    function PerferDestructuringWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PerferDestructuringWalker.prototype.performCheck = function (leftNode, rightNode, reportNode) {
        var name = leftNode.text;
        var propName = undefined;
        if (rightNode.kind === ts.SyntaxKind.PropertyAccessExpression) {
            propName = rightNode.name.text;
        }
        if (rightNode.kind === ts.SyntaxKind.ElementAccessExpression) {
            var argument = rightNode.argumentExpression;
            // filter array index access
            if (argument.kind === ts.SyntaxKind.StringLiteral) {
                propName = argument.text;
            }
        }
        if (name === propName) {
            this.addFailureAtNode(reportNode, 'Use object destructuring.');
        }
    };
    PerferDestructuringWalker.prototype.visitVariableDeclaration = function (node) {
        // Skip if variable is declared without assignment
        if (!node.initializer) {
            return;
        }
        if (node.name.kind !== ts.SyntaxKind.Identifier) {
            return;
        }
        this.performCheck(node.name, node.initializer, node);
    };
    PerferDestructuringWalker.prototype.visitBinaryExpression = function (node) {
        if (node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
            return;
        }
        if (node.left.kind !== ts.SyntaxKind.Identifier) {
            return;
        }
        this.performCheck(node.left, node.right, node);
    };
    return PerferDestructuringWalker;
}(tslint_1.RuleWalker));
var templateObject_1, templateObject_2;
