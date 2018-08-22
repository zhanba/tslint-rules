import * as ts from 'typescript'
import { Rules, RuleFailure, RuleWalker, IRuleMetadata, Utils } from 'tslint'
// import * as TsUtils from 'tsutils'

interface Options {
  VariableDeclarator: { array: boolean; object: boolean }
  AssignmentExpression: { array: boolean; object: boolean }
}

const options = {
  type: 'array',
  properties: {
    VariableDeclarator: {
      type: 'object',
      properties: {
        array: {
          type: 'boolean',
        },
        object: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    },
    AssignmentExpression: {
      type: 'object',
      properties: {
        array: {
          type: 'boolean',
        },
        object: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    },
  },
}

export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    ruleName: 'prefer-destructuring',
    type: 'style',
    description: Utils.dedent`
      require destructuring from arrays and/or objects
    `,
    optionsDescription: Utils.dedent``,
    options: null,
    optionExamples: [
      [
        true,
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: true,
            object: true,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
    ],
    typescriptOnly: false,
  }

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    return this.applyWithWalker(new PerferDestructuringWalker(sourceFile, this.getOptions()))
  }
}

class PerferDestructuringWalker extends RuleWalker {
  private performCheck(
    leftNode: ts.Identifier,
    rightNode: ts.PropertyAccessExpression | ts.ElementAccessExpression,
    reportNode: ts.Node
  ) {
    const name = (leftNode as ts.Identifier).text
    let propName = undefined
    if (rightNode.kind === ts.SyntaxKind.PropertyAccessExpression) {
      propName = (rightNode as ts.PropertyAccessExpression).name.text
    }
    if (rightNode.kind === ts.SyntaxKind.ElementAccessExpression) {
      const argument = (rightNode as ts.ElementAccessExpression).argumentExpression
      // filter array index access
      if (argument.kind === ts.SyntaxKind.StringLiteral) {
        propName = (argument as ts.StringLiteral).text
      }
    }
    if (name === propName) {
      this.addFailureAtNode(reportNode, 'Use object destructuring.')
    }
  }

  protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
    // Skip if variable is declared without assignment
    if (!node.initializer) {
      return
    }

    if (node.name.kind !== ts.SyntaxKind.Identifier) {
      return
    }

    this.performCheck(
      node.name as ts.Identifier,
      node.initializer as ts.PropertyAccessExpression | ts.ElementAccessExpression,
      node
    )
  }

  protected visitBinaryExpression(node: ts.BinaryExpression): void {
    if (node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
      return
    }

    if (node.left.kind !== ts.SyntaxKind.Identifier) {
      return
    }

    this.performCheck(
      node.left as ts.Identifier,
      node.right as ts.PropertyAccessExpression | ts.ElementAccessExpression,
      node
    )
  }
}
