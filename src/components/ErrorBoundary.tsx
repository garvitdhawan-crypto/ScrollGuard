import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { theme } from '../theme';
import { DoodleShield } from './DoodleIcons';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      showDetails: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary caught an error]', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, showDetails: false });
    this.props.onReset?.();
  };

  toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.iconContainer}>
              <DoodleShield color={theme.colors.error} size={64} />
            </View>

            <Text style={styles.title}>
              {this.props.fallbackTitle || 'System Glitch Detected'}
            </Text>

            <Text style={styles.subtitle}>
              A component ran into an unexpected snag. Your scroll data and kitten health are safely saved in local storage.
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={this.handleReset} activeOpacity={0.8}>
              <Text style={styles.retryButtonText}>↻ Reload Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={this.toggleDetails}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsToggleText}>
                {this.state.showDetails ? 'Hide Technical Details ▲' : 'Show Technical Details ▼'}
              </Text>
            </TouchableOpacity>

            {this.state.showDetails && this.state.error && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailsErrorText}>
                  {this.state.error.name}: {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text style={styles.detailsStackText}>
                    {this.state.error.stack.slice(0, 400)}...
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 87, 34, 0.12)',
    borderWidth: 1.5,
    borderColor: theme.colors.error,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
    maxWidth: 320,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: theme.spacing.md,
  },
  retryButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  detailsToggle: {
    padding: theme.spacing.sm,
  },
  detailsToggleText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
  },
  detailsBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  detailsErrorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 4,
  },
  detailsStackText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
});
